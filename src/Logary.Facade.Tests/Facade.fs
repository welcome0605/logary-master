﻿module Logary.Facade.Tests

open System
open Expecto
open Hopac
open Hopac.Infixes
open Logary.Facade
open Logary.Facade.Literals
open Logary.Facade.Literate
open Logary.Facade.LiterateFormatting

type internal TemplateToken =
  | TextToken of string
  | PropToken of name:string * format:string
  with
    override x.ToString() =
      match x with
      | TextToken s -> "TEXT("+s+")"
      | PropToken (n,f) -> "PROP("+n+":"+f+")"

let internal parseTemplateTokens template =
  let tokens = ResizeArray<TemplateToken>()
  let foundText t = tokens.Add (TextToken(t))
  let foundProp (p: FsMtParser.Property) =
    tokens.Add (PropToken(p.name, p.format))
  FsMtParser.parseParts template foundText foundProp
  tokens |> List.ofSeq

type ColouredText = string * ConsoleColor

type DateTimeOffset with
  member x.ToLiterateTime (?options: LiterateOptions) =
    let options = defaultArg options (LiterateOptions.create())
    x.ToLocalTime().ToString("HH:mm:ss", options.formatProvider)

[<AutoOpen>]
type LiterateTesting =
  /// Renders the `Message` using the `LiterateConsoleTarget` and returns the rendered coloured text parts.
  static member getWrittenColourParts (message, ?customTokeniser, ?options) =
    // Insteading of writing out to the console, write to an in-memory list so we can capture the values
    let writtenParts = ResizeArray<ColouredText>()
    let addToList _ (bits: ColouredText list) = writtenParts.AddRange bits
    let target =
      LiterateConsoleTarget(
        name = [||],
        minLevel = Verbose,
        ?options = options,
        ?literateTokeniser = customTokeniser,
        outputWriter = addToList)
      :> Logger
    target.logWithAck (true, Verbose) (fun _ -> message) >>- fun _ ->
    writtenParts :> ColouredText seq

type Expect =
  /// Asserts that the rendered output (`ColouredText`) matches the expected tokens (`TokenisedPart`) using
  /// the provided `LiterateOptions` (and theme)
  static member literateWrittenColouredTextEquals
                  (writtenColouredTextParts: ColouredText seq,
                   expectedTokens: LiterateTokenisation.TokenisedPart list,
                   ?options: LiterateOptions) =

    let options = defaultArg options (LiterateOptions.create())

    let actualOutputString = String.Join("", writtenColouredTextParts |> Seq.map fst)
    let expectedOutputString = String.Join("", expectedTokens |> List.map fst)
    Expect.equal actualOutputString expectedOutputString "literate rendered text must be correct"

    let actualParts = writtenColouredTextParts |> List.ofSeq
    let expectedParts = expectedTokens |> List.map (fun (s, t) -> s, options.theme t)
    Expect.sequenceEqual actualParts expectedParts "literate rendered colours must be correct"

  /// Asserts that the template rendered with the provided fields and options is equal to the
  /// provided message tokens. This assertion focuses on the mesage parts, excluding the other
  /// parts of the output template.
  static member literateMessagePartsEqual (template, fields, expectedMessagePartTokens, ?options) =
    let options = defaultArg options (LiterateOptions.create())
    let logLevel, logLevelToken = Info, LevelInfo
    let message =
      { Message.event logLevel template with
          context = fields |> Seq.map (fun (KeyValue (k, v)) -> Literals.FieldsPrefix + k, v) |> Map.ofSeq
          name = [|"X"; "Y"|] }
    let expectedTokens =
      [ yield "[",                              Punctuation
        yield message.timestampDateTimeOffset().ToLiterateTime(options),
                                                Subtext
        yield " ",                              Subtext
        yield options.getLogLevelText logLevel, logLevelToken
        yield "] ",                             Punctuation
        yield! expectedMessagePartTokens
        yield " ",                              Subtext
        yield "<",                              Punctuation
        yield "X.Y",                            Subtext
        yield ">",                              Punctuation
        yield Environment.NewLine,              Text ]

    LiterateTesting.getWrittenColourParts (message, options = options) >>- fun writtenParts ->
    let actualParts = writtenParts |> List.ofSeq
    let expectedParts = expectedTokens |> List.map (fun (s, t) -> s, options.theme t)
    Expect.sequenceEqual actualParts expectedParts "literate tokenised parts must be correct"

  static member literateCustomTokenisedPartsEqual (message, expectedTokens, ?customTokeniser, ?theme) =
    let options = match theme with
                  | Some theme -> { LiterateOptions.create() with theme = theme }
                  | None -> LiterateOptions.create()
    let writtenParts = ResizeArray<ColouredText>()
    let writtenPartsOutputWriter _ (bits: ColouredText list) = writtenParts.AddRange bits
    let target = LiterateConsoleTarget(name = [|"Facade";"Tests"|],
                                       minLevel = Verbose,
                                       options = options,
                                       ?literateTokeniser = customTokeniser,
                                       outputWriter = writtenPartsOutputWriter) :> Logger

    target.logWithAck (true, Verbose) (fun _ -> message) >>- fun _ ->
    // First compare the output text without any colours. This gives a better test failure message.
    let actualOutputString = String.Join("", writtenParts |> Seq.map fst)
    let expectedOutputString = String.Join("", expectedTokens |> List.map fst)
    Expect.equal actualOutputString expectedOutputString "literate tokenised rendered text must be correct"

  /// Asserts that the LiterateConsoleTarget renders the template (with the provided fields, options, and tokeniser) and
  /// outputs coloured text that (when themed) will match the expected tokens.
  static member literateOutputPartsEqual (message, expectedTokens, ?options, ?customTokeniser) =
    LiterateTesting.getWrittenColourParts (message, ?customTokeniser = customTokeniser, ?options = options) >>- fun writtenParts ->
    Expect.literateWrittenColouredTextEquals (writtenParts, expectedTokens, ?options = options)

[<Tests>]
let tests =
  let msg = Message.event Info "hi {name}"
  // don't print to console
  Global.initialise { Global.defaultConfig with getLogger = Targets.create Fatal }

  testList "facade" [
    testList "date and time" [
      testProperty "DateTimeOffset" <| fun (ts: DateTimeOffset) ->
        let roundtripped = ts.toTimestamp() |> DateTimeOffset.ofTimestamp
        Expect.equal roundtripped.Ticks ts.Ticks "should equal after conversion"

      testCase "known time" <| fun () ->
        let known = DateTimeOffset(2018, 05, 26, 13, 37, 05, 141, TimeSpan.Zero)
        known.toTimestamp()
          |> DateTimeOffset.ofTimestamp
          |> Flip.Expect.equal "Should eq known" known
    ]

    testList "message" [
      testCase "event" <| fun _ ->
        Message.event Info "hi {name}" |> ignore

      testCase "gauge" <| fun _ ->
        Message.gaugeWithUnit [| "dealership"; "car" |] "wheels" (Gauge (Int64 5L, Scalar)) |> ignore

      testCase "setSingleName" <| fun _ ->
        let msg = msg |> Message.setSingleName "Logary.Other"
        Expect.equal msg.name [| "Logary"; "Other" |] "Should have name set"

      testCase "setName" <| fun _ ->
        let msg = msg |> Message.setName [| "Logary"; "Other" |]
        Expect.equal msg.name [| "Logary"; "Other" |] "Should have name set"

      testCase "setFieldValue" <| fun _ ->
        let msg = msg |> Message.setField "fv" 33
        Expect.equal msg.context.[Literals.FieldsPrefix + "fv"] (box 33) "Should have field"

      testCase "setTimestamp" <| fun _ ->
        let now = DateTimeOffset.UtcNow
        let msg = msg |> Message.setTimestamp (now.toTimestamp())
        Expect.equal msg.timestamp (now.toTimestamp()) "Should have timestamp set"

      testCase "setLevel" <| fun _ ->
        Expect.equal msg.level Info "Initially Info"
        let msg = msg |> Message.setLevel Warn
        Expect.equal msg.level Warn "Should have Warn level now"
    ]

    testList "targets" [
      testCase "LiterateConsoleTarget logSimple" <| fun _ ->
        let logger = LiterateConsoleTarget([| "Facade"; "Tests" |], Warn) :> Logger
        Message.event Info "Aliens descended" |> logger.logSimple

      testProperty "Loggers.create" <| fun level ->
        Targets.create level |> ignore

      testCase "Targets.create and logSimple" <| fun () ->
        let logger = [| "Facade"; "Tests" |] |> Targets.create Error
        Message.event Verbose "Hi {name}" |> Message.setField "name" "haf" |> logger.logSimple
    ]

    testList "literate" [
      testCase "extract invalid property tokens as text" <| fun _ ->
        let template = "Hi {ho:##.###}, we're { something going on } special"
        let fields = Map [ "ho", box "hola"; "something going on", box "very" ]
        let tokens = parseTemplateTokens template
        Expect.equal tokens.Length 5 "Extracts 4 texts parts and 1 property part"
        Expect.equal tokens
                     [ TextToken ("Hi ")
                       PropToken ("ho", "##.###")
                       TextToken (", we're ") // <- a quirk of the parser
                       TextToken ("{ something going on }")
                       TextToken (" special") ]
                     "Should extract correct name and format parts"

      testCase "handles evil property strings correctly" <| fun _ ->
        let template = "{a}{b}{  c}{d  } {e} fghij {k}} {l} m {{}}"
        // validity:     +  +  --    --   +         +    +     --
        let expectedPropertyNames = ["a"; "b"; "e"; "k"; "l"]
        let subject = parseTemplateTokens template
        Expect.equal (subject |> List.choose (function PropToken (n,f) -> Some n | _ -> None))
                     expectedPropertyNames
                     "Should extract relevant names"

      testCase "treats `{{` and `}}` as escaped braces, resulting in a single brace in the output" <| fun _ ->
        let template = "hello {{@nonPropWithFormat:##}} {{you}} {are} a {{NonPropNoFormat}}"
        let tokens = parseTemplateTokens template
        Expect.equal tokens
                      [ TextToken("hello {@nonPropWithFormat:##} {you} ")
                        PropToken("are", null)
                        TextToken(" a {NonPropNoFormat}") ]
                     "double open or close braces are escaped"

      testCase "tokenises with field names correctly" <| fun _ ->
        let template = "Added {item} to cart {cartId} for {loginUserId} who now has total ${cartTotal}"
        let itemName, cartId, loginUserId, cartTotal = "TicTacs", Guid.NewGuid(), "AdamC", 123.45M
        let fields = Map [ "item", box itemName
                           "cartId", box cartId
                           "loginUserId", box loginUserId
                           "cartTotal", box cartTotal ]
        let options = { LiterateOptions.create() with printTemplateFieldNames = true }
        let expectedMessageParts =
          [ "Added ",               Text
            "[item] ",              Subtext
            "TicTacs",              StringSymbol
            " to cart ",            Text
            "[cartId] ",            Subtext
            cartId.ToString(),      OtherSymbol
            " for ",                Text
            "[loginUserId] ",       Subtext
            loginUserId,            StringSymbol
            " who now has total $", Text
            "[cartTotal] ",         Subtext
            cartTotal.ToString(),   NumericSymbol ]
        Expect.literateMessagePartsEqual (template, fields, expectedMessageParts, options)
        |> run

      testCase "tokenise on an empty message template" <| fun _ ->
        let emptyFields = Map.empty<string,obj>
        Expect.literateMessagePartsEqual ("", emptyFields, [])
        |> run

      testCase "tokenises missing fields with the `MissingTemplateField` token" <| fun _ ->
        let template = "Added {item} to cart {cartId:X} for {loginUserId} who now has total ${cartTotal}"
        let itemName, cartId, loginUserId, cartTotal = "TicTacs", Guid.NewGuid(), "AdamC", 123.45M
        let fields = Map [ "item", box itemName
                           // "cartId", box cartId
                           // "loginUserId", box loginUserId
                           "cartTotal", box cartTotal ]
        let options = { LiterateOptions.create() with printTemplateFieldNames = false }
        let expectedMessageParts =
          [ "Added ",               Text
            "TicTacs",              StringSymbol
            " to cart ",            Text
            "{cartId:X}",           MissingTemplateField
            " for ",                Text
            "{loginUserId}",        MissingTemplateField
            " who now has total $", Text
            cartTotal.ToString(),   NumericSymbol ]
        Expect.literateMessagePartsEqual (template, fields, expectedMessageParts)
        |> run

      testCase "default tokeniser uses the options `getLogLevelText()` correctly" <| fun _ ->
        let customGetLogLevelText = function Verbose->"A"| Debug->"B"| Info->"C"| Warn->"D"| Error->"E"| Fatal->"F"
        let options = { LiterateOptions.createInvariant() with
                          getLogLevelText = customGetLogLevelText }
        let now = Global.getTimestamp ()
        let nowDto = DateTimeOffset.ofTimestamp now
        let msg level = Message.event level "" |> fun m -> { m with timestamp = now; name = [|"A";"B"|] }
        let nowTimeString = nowDto.LocalDateTime.ToString("HH:mm:ss")
        [ Verbose, LevelVerbose, "A"
          Debug,   LevelDebug,   "B"
          Info,    LevelInfo,    "C"
          Warn,    LevelWarning, "D"
          Error,   LevelError,   "E"
          Fatal,   LevelFatal,   "F" ]
        |> List.iter (fun (logLevel, expectedLevelToken, expectedText) ->
          LiterateTokenisation.tokeniseMessage options (msg logLevel)
            |> Flip.Expect.sequenceEqual
                (sprintf "expect log level %A to render as token %A with text %s" logLevel expectedLevelToken expectedText)
                [ "[",            Punctuation
                  nowTimeString,  Subtext
                  " ",            Subtext
                  expectedText,   expectedLevelToken
                  "] ",           Punctuation
                  " ",            Subtext
                  "<",            Punctuation
                  "A.B",          Subtext
                  ">",            Punctuation ])

      testProperty "theme is applied correctly" <| fun (theme: LiterateToken -> ConsoleColor) ->
        let options = { LiterateOptions.create() with theme = theme }
        let fields = Map [ Literals.FieldsPrefix + "where", box "The Other Side" ]
        let message = { Message.event Warn "Hello from {where}" with context = fields }
        let expectedTimestamp = message.timestampDateTimeOffset().ToLiterateTime (LiterateOptions.create())
        let nl = Environment.NewLine
        let expectedTokens =
          [ "[",                      Punctuation
            expectedTimestamp,        Subtext
            " ",                      Subtext
            "WRN",                    LevelWarning
            "] ",                     Punctuation
            "Hello from ",            Text
            "The Other Side",         StringSymbol
            Environment.NewLine,      Text ]

        Expect.literateOutputPartsEqual (message, expectedTokens, options=options)
        |> run

      testPropertyWithConfig FsCheckConfig.defaultConfig "default tokeniser uses the options `formatProvider` correctly" <| fun (amount: decimal, date: DateTimeOffset) ->
        [ "fr-FR"; "da-DK"; "de-DE"; "en-AU"; "en-US"; ]
        |> List.iter (fun cultureName ->
          let options = { LiterateOptions.createInvariant() with
                            formatProvider = System.Globalization.CultureInfo(cultureName) }
          let template = "As of {date:F}, you have a balance of {amount:C2}"
          let fields = [ "amount", box amount; "date", box date ] |> Map
          let expectedMessageParts =
            [ "As of ",                                       Text
              date.ToString("F", options.formatProvider),     OtherSymbol
              ", you have a balance of ",                     Text
              amount.ToString("C2", options.formatProvider),  NumericSymbol ]

          Expect.literateMessagePartsEqual (template, fields, expectedMessageParts, options)
          |> run
        )

      testCase "default tokeniser can yield exception tokens from the 'errors' and 'exn' fields, even with an empty template" <| fun _ ->
        let template = "Hello from {where}"
        let exn1 = exn "exn field"
        let exns2 = [ exn "errors field 1"; exn "errors field 2" ]
        let message =
          Message.event Debug template
          |> Message.addExn exn1
          |> Message.addExn exns2.[0]
          |> Message.addExn exns2.[1]
          |> Message.setField "where" "The Other Side"
        let expectedTimestamp = message.timestampDateTimeOffset().ToLiterateTime (LiterateOptions.create())
        let nl = Environment.NewLine
        let expectedTokens =
          [ "[",                      Punctuation
            expectedTimestamp,        Subtext
            " ",                      Subtext
            "DBG",                    LevelDebug
            "] ",                     Punctuation
            "Hello from ",            Text
            "The Other Side",         StringSymbol
            nl,                                 Text
            "System.Exception: exn field",      Text
            nl,                                 Text
            "System.Exception: errors field 1", Text
            nl,                                 Text
            "System.Exception: errors field 2", Text
            nl,                                 Text
          ]

        Expect.literateOutputPartsEqual (message, expectedTokens)
        |> run

      testCase "tokenises without field names correctly" <| fun _ ->
        let template = "Added {item} to cart {cartId} for {loginUserId} who now has total ${cartTotal}"
        let itemName, cartId, loginUserId, cartTotal = "TicTacs", Guid.NewGuid(), "AdamC", 123.45M
        let fields = Map [ "item", box itemName
                           "cartId", box cartId
                           "loginUserId", box loginUserId
                           "cartTotal", box cartTotal ]
        let options = { LiterateOptions.create() with printTemplateFieldNames = false }
        let expectedMessageParts =
          [ "Added ",               Text
            "TicTacs",              StringSymbol
            " to cart ",            Text
            cartId.ToString(),      OtherSymbol
            " for ",                Text
            loginUserId,            StringSymbol
            " who now has total $", Text
            cartTotal.ToString(),   NumericSymbol ]
        Expect.literateMessagePartsEqual (template, fields, expectedMessageParts, options)
        |> run

      testCase "default rendering will put the message name/source before the exception details" <| fun _ ->
        let message =
          Message.event Debug "Hello from {where}"
          |> Message.setSingleName "World.UK.Adele"
          |> Message.setField "where" "The Other Side"
          |> Message.addExn (exn("e1"))
          |> Message.addExn (exn("e2"))

        let expectedTimestamp = message.timestampDateTimeOffset().ToLiterateTime (LiterateOptions.create())
        let nl = Environment.NewLine
        let expectedTokens =
          [ "[",                  Punctuation
            expectedTimestamp,    Subtext
            " ",                  Subtext
            "DBG",                LevelDebug
            "] ",                 Punctuation
            "Hello from ",        Text
            "The Other Side",     StringSymbol
            " ",                  Subtext
            "<",                  Punctuation
            "World.UK.Adele",     Subtext
            ">",                  Punctuation

            nl,                     Text
            "System.Exception: e1", Text
            nl,                     Text
            "System.Exception: e2", Text
            nl,                     Text
          ]

        Expect.literateOutputPartsEqual (message, expectedTokens)
        |> run

      testCase "message without name skips outputting it" <| fun _ ->
        let message =
          Message.event Debug "Hello from {where}"
          |> Message.setSingleName ""
          |> Message.setField "where" "The Other Side"

        let expectedTimestamp = message.timestampDateTimeOffset().ToLiterateTime (LiterateOptions.create())
        let expectedTokens =
          [ "[",                  Punctuation
            expectedTimestamp,    Subtext
            " ",                  Subtext
            "DBG",                LevelDebug
            "] ",                 Punctuation
            "Hello from ",        Text
            "The Other Side",     StringSymbol
            Environment.NewLine,  Text ]

        Expect.literateOutputPartsEqual (message, expectedTokens)
        |> run

      testCase "replacing the default tokeniser is possible" <| fun _ ->
        let customTokeniser = tokeniserForOutputTemplate "[{timestamp:HH:mm:ss} {level}] {message} [{source}]{exceptions}"
        let message =
          Message.event Debug "Hello from {where}"
            |> Message.setSingleName "World.UK.Adele"
            |> Message.setField "where" "The Other Side"
        let expectedTimestamp = message.timestampDateTimeOffset().ToLiterateTime (LiterateOptions.create())
        let expectedTokens =
          [ "[",                  Punctuation
            expectedTimestamp,    Subtext
            " ",                  Punctuation
            "DBG",                LevelDebug
            "] ",                 Punctuation
            "Hello from ",        Text
            "The Other Side",     StringSymbol
            " [",                 Punctuation
            "World.UK.Adele",     Subtext
            "]",                  Punctuation
            Environment.NewLine,  Text ]

        Expect.literateOutputPartsEqual (message, expectedTokens, customTokeniser = customTokeniser)
        |> run

      testList "custom output template fields render correctly" [
        let nl = Environment.NewLine
        let level = Info
        let source = "Abc.Def.Ghi"
        let options = LiterateOptions.create()
        let templatePropName1, templatePropValue1 = "who", "world"
        let nonTemplatePropName1, nonTemplatePropValue1 = "ntprop1", Guid.NewGuid()
        let nonTemplatePropName2, nonTemplatePropValue2 = "ntprop2", Guid.NewGuid()
        let msgTemplate = "Hello {" + templatePropName1 + "}"
        let msg = Message.event level msgTemplate
                  |> Message.setField templatePropName1 templatePropValue1
                  |> Message.setField nonTemplatePropName1 nonTemplatePropValue1
                  |> Message.setField nonTemplatePropName2 nonTemplatePropValue2
                  |> Message.setSingleName source
                  |> Message.addExn (exn "ex1")
                  |> Message.addExn (exn "ex2")
        let msgDto = msg.timestampDateTimeOffset()
        let outputTemplateAndExpected =
          [ "{timestamp:u}",                msgDto.ToLocalTime().ToString("u")
            "{timestampUtc:u}",             msgDto.ToString("u")
            "{level}",                      (options.getLogLevelText msg.level)
            "{source}",                     source
            "{newline}",                    nl
            "{tab}",                        "\t"
            "{message}",                    "Hello world"
            "{newLineIfNext}{properties}",  nl + " - " + nonTemplatePropName1 + ": " + (string nonTemplatePropValue1) +
                                            nl + " - " + nonTemplatePropName2 + ": " + (string nonTemplatePropValue2)
            "{newLineIfNext} {properties}", "  - " + nonTemplatePropName1 + ": " + (string nonTemplatePropValue1) +
                                            nl + " - " + nonTemplatePropName2 + ": " + (string nonTemplatePropValue2)
            "{properties}",                 " - " + nonTemplatePropName1 + ": " + (string nonTemplatePropValue1) +
                                            nl + " - " + nonTemplatePropName2 + ": " + (string nonTemplatePropValue2)
            "{exceptions}",                 nl + "System.Exception: ex1" + nl + "System.Exception: ex2"
            "",                             "" ]

        for (outputTemplate, expected) in outputTemplateAndExpected do
          yield testCase outputTemplate <| fun _ ->
            let output = ResizeArray<ColouredText>()
            let outputWriter (_:obj) (bits:ColouredText list) = output.AddRange bits
            let target = LiterateConsoleTarget([|"Root"|], Verbose, outputTemplate, options, outputWriter) :> Logger
            target.logWithAck (true, level) (fun _ -> msg)
              |> run
              |> Flip.Expect.isOk "Should successfully log"
            let actualText = String.Join("", output |> Seq.map fst)
            Expect.equal actualText (expected + nl) "output must be correct"
      ]

      testCase "format template with invalid property correctly" <| fun _ ->
        // spaces are not valid in property names, so the 'property' is treated as text
        let str = "Hi {ho}, we're { something going on  } special"
        let fields =
          [ "ho", box "hola"
            "something going on", box "very" ]
          |> Seq.map (fun (k, v) -> Literals.FieldsPrefix + k, v)
          |> Map.ofSeq
        let now = Global.getTimestamp ()
        let nowDto = DateTimeOffset.ofTimestamp now
        let msg =
          Message.event Info str
          |> fun m -> { m with context = fields; timestamp = now }
          |> Message.setSingleName "Logary.Facade.Tests"
        let subject = Formatting.defaultFormatter msg
        Expect.equal subject
                     (sprintf "[I] %s: Hi hola, we're { something going on  } special [Logary.Facade.Tests]\n - something going on: very" (nowDto.ToString("o")))
                     "Should format correctly"
    ]
  ]
