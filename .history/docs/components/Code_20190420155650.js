import Lowlight from 'react-lowlight'
const Code = (props) => <Lowlight {...props} />
Code.propTypes = Lowlight.propTypes;
console.log(Code.propTypes);
export default Code