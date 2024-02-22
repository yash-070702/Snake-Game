const gameBoard=document.querySelector(".game-board");
const score_box=document.querySelector("#score");
const game_Over_Box=document.querySelector(".gameover");
const currentScore=document.querySelector(".curr");
const firstChoice=document.querySelector(".question");
const searchInput =document.querySelector("[data-searchInput]");
const searchForm=document.querySelector("[data-searchForm]");
const name_bar=document.querySelector(".center");
const your_name=document.querySelector(".your_name");
const hi_score=document.querySelector(".hi-score");
let hiscore=0;
let foodElement;
let snakeElement;
let score=0;
let lastPaintTime=0;
let SNAKE_SPEED=1.5;
let inputDirection={x:0,y:0};   //to control the direction of the moving direction of the snake
let lastInputDirection=inputDirection;
const expansion_amount=1;      //this variable will decide that how much snake will grow after every eat of the apple

 window.localStorage.setItem("hi-score",hiscore);


let snake_body=[
    {x:Math.ceil(Math.random()*15),y:Math.ceil(Math.random()*15)},//it will intialise the intial coordinates of the snake
    
]

function Enter_name()
{
searchInput.value="";
    searchForm.addEventListener("submit",(event)=>{   // is pure code m jo event pass hua hai vo default hota hai aur ye search
 /*is prevent ka mtlb hai ki jo submit                //ke input m jo value aai hai use fetch krne ke kaam m aata hai
 ki default working hai use haa do aur
mere hisab se kaam kro*/
    event.preventDefault();      
        let choice=searchInput.value;
 
        if(choice==="")
         return;

         else{
         Start_game();
         choice=choice.toUpperCase();
         your_name.innerHTML=`Name:${choice}`;
         
         }
    
     });
}

Enter_name();

function Start_game(){
    snake_body=[
        {x:Math.ceil(Math.random()*15),y:Math.ceil(Math.random()*15)},//it will intialise the intial coordinates of the snake
        
    ];
   hiscore=localStorage.getItem("hi-score");
    score=0;
    SNAKE_SPEED=1.5;
    inputDirection={x:0,y:0};
    
hi_score.innerHTML=`Hi-Score:${hiscore}`;
    name_bar.style.display="none";
    gameBoard.style.display="grid";
    game_Over_Box.style.display="none";
    let food=getFoodRandomPosition();
    score_box.innerHTML=`Score:0`;


    function play(currentTime){         //requestAnimationframe will retrun the current time in ms
        let TimeSeconds=(currentTime-lastPaintTime)/1000;   //it will convert the ms seconds into the seconds;
        requestAnimationFrame(play);
    
        if(TimeSeconds < 1/SNAKE_SPEED)
        return ;       // yeh isilie hai ki ek seconds se phle kuch na print ho ,agr hm snake speed 2 le lenege to 1 sec m 2 baar print hoga 3 lenege to ek second me 3 baar print hoga
    lastPaintTime=currentTime;
    snake_update();
    draw();
    }
    requestAnimationFrame(play);
    
    function snake_update(){
        gameBoard.innerHTML="";
    snake_move();
    snake_Eat_Food();
    }
    
    function draw()
    {
       drawSnake();
       drawFood();
    }


    function drawSnake(){
        snake_body.forEach((segment,index)=>{
            snakeElement=document.createElement("div");
            snakeElement.style.gridColumnStart=segment.x;
            snakeElement.style.gridRowStart=segment.y;
            snakeElement.style.transform="rotate(0deg)";   // to rotate the face according to the direction of the snake
    
            if(index===0){
            snakeElement.classList.add("head");
    
            if(inputDirection.x==1){
                snakeElement.style.transform="rotate(-90deg)";
            }
            else if(inputDirection.x==-1)
            snakeElement.style.transform="rotate(90deg)";
    
            else if(inputDirection.y==-1){
                snakeElement.style.transform="rotate(180deg)"; 
            }
    
            else if(inputDirection.y==1){
            snakeElement.style.transform="rotate(0deg)";
            }
        }
        else
            snakeElement.classList.add("snake");
    
            gameBoard.appendChild(snakeElement);
        });
        
    }
    
    function drawFood(){
     foodElement=document.createElement("div");
        foodElement.style.gridColumnStart=food.x;
        foodElement.style.gridRowStart=food.y;
        foodElement.classList.add("food");
        gameBoard.appendChild(foodElement);
    }
    
    function snake_Eat_Food()
    {
        if(snake_body[0].x===food.x && snake_body[0].y===food.y){
    console.log("easted");
    SNAKE_SPEED+=0.15;
    score+=10;
    score_box.innerHTML=`Score:${score}`;
    expand_snake();
    food=getFoodRandomPosition();   // this function will update the position of apple after every eat
    
        }
        
    }
    
    function expand_snake(){
        for(i=1;i<=expansion_amount;i++)
        {
            snake_body.push(snake_body[snake_body.length-1]);    // this function will add equal no of boxes to expansion amount at end after every eat of apple
    
        }
    }
    
    function getFoodRandomPosition(){
    
        let a,b,my_Condition=true;
    
        while(my_Condition){
            a=Math.ceil(Math.random()*15);
            b=Math.ceil(Math.random()*15);
    
            my_Condition=snake_body.some(segment=>{     // some is a js function that will traverse whole aaray and retrun either true or false 
                return segment.x===a && segment.y===b;  //now my_Condition will eihter have true or false value and while will be continue work untill it will return false means a and b have coordinates that are not related to any body part of the snake    
            });
        }
    return  {x:a,y:b};
    }
    
    function snake_move()
    {
        getInputDirection();
    
        for(i=snake_body.length-2;i>=0;i--)
        {
            snake_body[i+1]={...snake_body[i]};   //to follow the pehle wala block
        }
        snake_body[0].x+=inputDirection.x;
        snake_body[0].y+=inputDirection.y;
       if( check_Game_Over()){
        game_Over_Box.style.display="flex";
        gameBoard.style.display="none";
        currentScore.innerHTML=` Your Score:${score}`;
    
        if(score>hiscore)
        {
            window.localStorage.setItem("hi-score",score);
        }


        document.addEventListener("keydown",e=>{
            if(e.key=="Enter")
            {   
            Start_game();
            return ;
            }
        })
       }
    }
    
    function getInputDirection(){
        window.addEventListener("keydown",e=>{    //we are using lastInputDirection variable to avoid exact 180 rotation of the snake
           switch(e.key){
            case 'ArrowUp' :
            if(lastInputDirection.y==1)break;    
            inputDirection={x:0,y:-1};  // to move snake upwards
            break;
    
            case 'ArrowRight' :
            if(lastInputDirection.x==-1)break;     
            inputDirection={x:1,y:0};  // to move snake rightward
            break;
              
            case 'ArrowLeft' :
            if(lastInputDirection.x==1)break;      
            inputDirection={x:-1,y:0};  // to move snake leftward
            break;
    
            case 'ArrowDown' :
            if(lastInputDirection.y==-1)break;     
            inputDirection={x:0,y:1};  // to move snake downward
            break;
    
            default:return;
           }
        })
        lastInputDirection=inputDirection;
    }
    function check_Game_Over(){
       
    return (out_Of_grid() || Eat_Itself())
    }
       
    function out_Of_grid()
    {
        if(snake_body[0].x>15 || snake_body[0].x<0 || snake_body[0].y>15 ||snake_body[0].y<0) // this condition will check ki snake bahar to nhi chla gya greed se
       return true;
    
       else 
       return false;
    }
    
    function Eat_Itself(){
    for(i=1;i<snake_body.length;i++)
    {
    if(snake_body[0].x===snake_body[i].x && snake_body[0].y===snake_body[i].y)
    return true;
    }
    return false;
    }
}

