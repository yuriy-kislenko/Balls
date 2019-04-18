var hp = 5;
var hpFieldHeading = 'HP: '
var hpField = document.querySelector('.hp').innerHTML = hpFieldHeading + hp;

function Balls(field, speed, onGameOver, onDel) {
    this.construct = function() {
        this.speed = speed;
        this.field = field;
        this.posY = 0;
        this.life = true;
        this.radius = this.myRandom(20, 40);
        this.posX = this.myRandom(0, field.clientWidth);
        this.onGameOver = onGameOver;
        this.onDel = onDel;
        this.createBall();
    };
    this.createBall = function() {
        this.ball = document.createElement('div');
        this.ball.className = 'ball';
        this.ball.style.width = this.radius + 'px';
        this.ball.style.height = this.radius + 'px';
        this.ball.style.borderRadius = '50%';
        this.ball.style.background = 'red';
        this.ball.style.position = 'absolute';
        this.ball.style.left = this.posX + 'px';
        this.ball.style.top = this.posY + 'px';
        this.field.appendChild(this.ball);
        var self = this;
        this.ball.addEventListener('mousemove', function(){
            self.destroy();
            self.onDel();
        });
    };
    this.myRandom = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    this.isOut = function() {
        var maxh = this.field.clientHeight;
        return this.posY > maxh;
    };
    this.move = function() {
        this.posY += this.speed;
        this.ball.style.top = this.posY + 'px';
        
        if(this.isOut()){
            this.destroy();
            hp--;
            document.querySelector('.hp').innerHTML = hpFieldHeading + hp;
            if(hp === 0) {
                this.onGameOver();
            }
        }
    };
    this.destroy = function() {
        this.life = false;
        this.ball.remove();
        delete this;
    };
    this.construct();
};

function Game() {};
Game.init = function() {
    Game.field = document.body;
    Game.score = document.querySelector('.score');
    Game.countClick = 0;
    Game.scoreHeading = 'Score: ';
    Game.ballsAll = [];
    Game.lvl = 10;
    Game.life = true;
    Game.timer = setInterval(function(){
        Game.step();
        }, 40);
        Game.generateBalls();
    };
    Game.generateBalls = function() {
        if(!Game.life) return;
        Game.createBalls();
        var time = 2000 - 100 * Game.lvl;
        setTimeout(function() {
            Game.generateBalls();
        }, time);
    };
    Game.createBalls = function() {
        Game.ballsAll.push(new Balls(
            Game.field,
            Game.lvl,
            function() {
                Game.onGameOver();
            },
            function() {
                Game.onDel();
            },
        ));
    };
    Game.step = function() {
        Game.ballsAll = Game.ballsAll.filter(function(elem){
            return elem.life;
        });
        Game.ballsAll.forEach(function(elem){
            elem.move();
        })
    };
    Game.onGameOver = function() {
        clearInterval(Game.timer);
        Game.life = false;
        Game.ballsAll.forEach(function(elem){
            elem.destroy();
        });
        alert('Game over!\n Your score: ' + Game.countClick);
        var restart = confirm('Do you want restart ? ');
        if(restart === true) {
            document.location.reload(true);
        }
    };
    Game.onDel = function() {
        Game.countClick++;
        if(Game.countClick % 10 === 0) {
            Game.lvl += 1;
        };
        Game.score.innerHTML = Game.scoreHeading + Game.countClick;
    };

document.addEventListener('DOMContentLoaded', function(){
    Game.init();
});