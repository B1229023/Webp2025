import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
const changeText=(event)=>{
    console.log(event.target)
    event.target.innerText = event.target.innerText + "被點了"
  } 
const MultiButton=()=>{
    var output=[];
    output.push(
        <IconButton color="primary" aria-label="add to shopping cart">
            <AddShoppingCartIcon />
        </IconButton>)
    output.push(
        <IconButton color="primary" aria-label="delete">
            <DeleteIcon />
        </IconButton>)
    output.push(
        <IconButton color="primary" aria-label="add an alarm">
            <AlarmIcon />
        </IconButton>)
    
    return output;
 }

 export default MultiButton;

 //for(let i=1;i<num+1;++i)
   // output.push(<button variant="contained" color="primary" 
      //onClick={changeText}>第{i}個按鍵</button>)
      //)