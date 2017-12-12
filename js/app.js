//全局变量
var stepOffsetX = 101; //一个格子的宽度
var stepOffsetY = 83;  //一个格子的高度
var checkOffetX = stepOffsetY - 15;  //用于碰撞检测时的格子宽度，因为素材图片四周有留白，所以减去多余部分
var isGameStop = false; //用于记录游戏是否结束
var allEnemies = [];
var player = null;
var lifesNum = 3; //初始化有3条命
var lifesNumDom = document.getElementById('lifes-num');

// 这是我们的玩家要躲避的敌人
var Enemy = function(x, y, speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed || 0;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt, index) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if(this.x <= 503){
        this.x += this.speed*dt;
    }else{
        //超出画布范围，删除敌人
        allEnemies.splice(index,1);
    }

    //怪物碰撞检测
    if(this.y == player.y && this.x >= player.x-checkOffetX && this.x <= (player.x+checkOffetX)){
        //该怪物与玩家处于同一行，且与玩家所在位置有交集
        console.log('第'+index+'怪物与玩家碰撞');
        setLifesNum(--lifesNum);
        if(lifesNum <= 0){
            resetPlayer(true);
            swal({
                title: '很遗憾，你输啦！',
                text: '请再接再厉哦',
                confirmButtonText: '再来一遍',
                imageUrl: 'images/cry.png'
            },function(){
                setLifesNum(3);
            });
        }else{
            resetPlayer(false);
        }
    }

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数

//继承Enemy类
var Player = function(x, y){
    Enemy.call(this,x,y);
    this.sprite = 'images/char-boy.png';
}

Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function(){
    //重写update 函数
}
Player.prototype.handleInput = function(direction){
    switch (direction){
        case 'left':
                if(this.x > 0){
                    this.x -= stepOffsetX;
                }
            break;
        case 'up':
                if(this.y > -32){
                    this.y -= stepOffsetY;
                }
            break;
        case 'right':
                if(this.x < 404){
                    this.x += stepOffsetX;
                }
            break;
        case 'down':
                if(this.y < 383){
                    this.y += stepOffsetY;
                }
            break;
    }


    checkIsWin(this.y);

    // console.log('x:'+this.x);
    // console.log('y:'+this.y);
    //y最大383 y最小51 x最小-2 x最大402
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
player = new Player(202,383);
function randomEnemies(){
    var startX = -101;
    var startY = parseInt(Math.random()*3)*83+51;
    var speed = (parseInt(Math.random()*3)+1)*100;
    allEnemies.push(new Enemy(startX, startY, speed));
}

function checkIsWin(playerY){
    if(playerY == -32 && !isGameStop){
        var tempString = '';
        for(var i=0; i<lifesNum; i++){
            tempString += '★';
        }
        //swal 是引入的sweetalert弹窗插件
        swal({
            title: '恭喜~ 你赢啦！',
            text: '星级评分：' + tempString,
            confirmButtonText: '再来一遍',
            imageUrl: 'images/thumbs-up.jpg'
        },function(){
            resetPlayer(true);
            setLifesNum(3);
        });
        isGameStop = true;
    }
}

function resetPlayer(isResetEnemies){
    player.x = 202;
    player.y = 383;
    isGameStop = false;
    if(isResetEnemies){
        allEnemies = [];
    }
}

function setLifesNum(num){
    if(num){
        lifesNum = num;
    }
    lifesNumDom.innerHTML = 'x '+ lifesNum;
}

function startGame(){
    setLifesNum();
    setInterval(function(){
        randomEnemies();
    },1000);
}
startGame();



// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
