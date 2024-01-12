var splashScreenimg, bg_img, bg2_img;
var play_button;
var about_button;
var gameState = "wait";
var health = 200, maxHealth = 200, score = 0;
var player, player_img, player2, player2_img, player2_rev_img;
var enemy1img, enemy2img, enemy3img, enemy5img, enemy6img, enemy7img, enemy8img, enemy9img;
var enemy, enemygroup;
var bullet, bulletgroup, bulletimg;

function preload() {
    splashScreenimg = loadImage("assets/splashScreen.gif");
    bg_img = loadImage("assets/bg_1.png");
    bg2_img = loadImage("assets/bg_2.jpg");

    player_img = loadImage("assets/player_img.png");
    player2_img = loadImage("assets/player2.gif");
    player2_rev_img = loadImage("assets/player2_reverse.gif");
    enemy1img = loadImage("assets/enemy1.png");
    enemy2img = loadImage("assets/enemy2.png");
    enemy3img = loadImage("assets/enemy3.png");
    enemy5img = loadImage("assets/enemy5.gif");
    enemy6img = loadImage("assets/enemy6.gif");
    enemy7img = loadImage("assets/enemy7.gif");
    enemy8img = loadImage("assets/enemy8.gif");
    bulletimg = loadImage("assets/bullet.png");


}

function setup() {
    createCanvas(windowWidth, windowHeight);

    play_button = createImg("assets/PlayBtn.png");
    play_button.position(width / 4, windowHeight / 2 - 90);
    play_button.size(80, 80);
    play_button.hide();



    about_button = createImg("assets/AboutBtn.png")
    about_button.position(windowWidth / 2, windowHeight / 2);
    about_button.size(80, 80);
    about_button.hide();


    player = createSprite(windowWidth / 15, windowHeight - 120);
    player.addImage(player_img);
    player.scale = 0.9;
    player.visible = false;

    player2 = createSprite(windowWidth / 15, windowHeight - 120);
    player2.addImage("right", player2_img);
   // player2.addImage("left", player2_rev_img);
    player2.scale = 0.9;
    player2.visible = false;

    enemygroup = new Group();
    bulletgroup = new Group();



    invisibleground = createSprite(width / 2, height - height / 12, width, 20)
    invisibleground.visible = false
}

function draw() {

    if (gameState == "wait") {
        background(splashScreenimg);
        play_button.show();
        about_button.show();
    }
    about_button.mousePressed(() => {
        play_button.hide();
        about_button.hide();
        console.log("about")
        gameState = "about";

    })
    play_button.mousePressed(() => {
        play_button.hide();
        about_button.hide();
        gameState = "level1";

    })



    if (gameState == "about") {
        aboutGame();
    }



    if (gameState == "level1") {
        background(bg_img);
        player.visible = true;
        movement();
        healthlevel();
        spawnEnemies_level1();
        player.collide(invisibleground);

        for (var i = 0; i < enemygroup.length; i++) {
            if (bulletgroup.isTouching(enemygroup.get(i))) {
                score += 5;
                enemygroup.get(i).remove();
                bulletgroup.destroyEach();
            }
        }
        for (var i = 0; i < enemygroup.length; i++) {
            if (player.isTouching(enemygroup.get(i))) {
                health -= 10;
                enemygroup.get(i).remove();
                bulletgroup.destroyEach();
            }
        }

        if (health > 0 && score >=5) {
            gameState = "nextLevelInfo";
            enemygroup.destroyEach();
            bulletgroup.destroyEach();
            player.visible = false;


        }

        if (gameState == "nextLevelInfo") {
            nextLevelInfoPopUp();
        }

    }

    if (gameState == "level2") {
       
        image(bg2_img,-width*5,windowHeight*1.5,width*4,windowHeight*3);
        player2.visible = true;
        camera.position.x = player2.position.x;

        movement();
        healthlevel();
        spawnEnemies_level2();
        player2.collide(invisibleground);
        
        for (var i = 0; i < enemygroup.length; i++) {
            if (player.isTouching(enemygroup.get(i))) {
                health -= 10;
                enemygroup.get(i).remove();
                bulletgroup.destroyEach();
            }
        }

        if (health > 0 && score > 10) {
            gameState = "nextLevelInfo";
            enemygroup.destroyEach();
            bulletgroup.destroyEach();
            player.visible = false;


        }




    }

    drawSprites();
    if (gameState == "level1") {
        fill("red");
        textSize(20);
        text("SCORE: " + score, windowWidth - 190, windowHeight / 6 - 20);

    }

}
function aboutGame() {
    swal({
        title: "About this game",
        text: "Kill all the enemies and survive in the forest",
        textAlign: "CENTER",
        imageUrl: "assets/splashScreen.gif",
        imageSize: "200x200",
        confirmButtonText: "Let's kill and thrive",
        confirmButtoncolor: "brown"

    },
        function () {
            gameState = "wait"
        }

    )

}

function playBtn() {
    play_button.hide();
    about_button.hide();
    console.log("play")

    gameState = "play"
}

function healthlevel() {

    stroke("lightgreen");
    strokeWeight(10);
    noFill();
    rect(windowWidth / 10 - 100, windowHeight / 10, maxHealth, 20)

    noStroke();
    fill("green");
    rect(windowWidth / 10 - 100, windowHeight / 10, health, 20)

}
function movement() {
    if (player.x > windowWidth) {
        player.x = windowWidth - 40;
    }
    if (player.x < 30) {
        player.x = 40;
    }
    // if( player.y > windowHeight/4){
    //     player.y = windowHeight-150;
    // }
    if (player.y < 0) {
        player.y = windowHeight / 4;
    }
    if (keyDown("UP_ARROW")) {
        // player.y-= 25;

        player.velocityY = -5
    }

    player.velocityY += 0.8

    if (keyDown("RIGHT_ARROW")) {
        player.x += 50;
    }
    if (keyDown("LEFT_ARROW")) {
        player.x -= 5;
    }
    if (keyDown("DOWN_ARROW")) {
        player.y += 25;
    }
    if (keyDown("SPACE")) {
        spawnBullets();
    }
}

function spawnEnemies_level1() {

    if (frameCount % 100 == 0) {
        var rand = Math.round(Math.random(0, windowHeight - 100));

        enemy = createSprite(width, rand);
        enemy.debug = true;

        var randimg = Math.round((Math.random() * 4) + 1);
        switch (randimg) {
            case 1:
                enemy.x = windowWidth - 50;
                enemy.y = windowHeight - 130;
                enemy.scale = 0.7;
                enemy.addImage(enemy5img)
                enemy.velocityX = -4;
                enemy.setCollider("rectangle", 0, 0, 120, 120);
                break;
            case 2:
                enemy.x = windowWidth - 50;
                enemy.y = windowHeight - 130;
                enemy.scale = 0.4;
                enemy.addImage(enemy7img);
                enemy.velocityX = -4;
                enemy.setCollider("rectangle", 0, 0, 250, 300);
                break;
            case 3:
                enemy.x = windowWidth - 50;
                enemy.y = windowHeight - 130;
                enemy.scale = 0.7;
                enemy.addImage(enemy8img);
                enemy.velocityX = -4;
                enemy.setCollider("rectangle", 0, 0, 50, 50);
                break;
            default:
                break;
        }
        enemygroup.add(enemy);
    }
}

function spawnEnemies_level2() {
    if (frameCount % 100 == 0) {
        //var rand = Math.round(Math.random(0, windowHeight - 100));

        enemy = createSprite(width, height/3);
        enemy.debug = true;

        var randimg = Math.round((Math.random() * 4) + 1);
        switch (randimg) {
            case 1:
                enemy.x = windowWidth - 50;
                enemy.y = windowHeight - 130;
                enemy.scale = 0.3;
                enemy.addImage(enemy1img)
                enemy.velocityX = -4;
                enemy.setCollider("rectangle", 0, 0, 120, 120);
                break;
            case 2:
                enemy.x = windowWidth - 50;
                enemy.y = windowHeight - 130;
                enemy.scale = 0.4;
                enemy.addImage(enemy2img);
                enemy.velocityX = -4;
                enemy.setCollider("rectangle", 0, 0, 250, 300);
                break;
            case 3:
                enemy.x = windowWidth - 50;
                enemy.y = windowHeight - 130;
                enemy.scale = 0.4;
                enemy.addImage(enemy6img);
                enemy.velocityX = -4;
                enemy.setCollider("rectangle", 0, 0, 250, 300);
                break;
            default:
                break;
        }
        enemygroup.add(enemy);
    }       
}


function spawnBullets() {

    bullet = createSprite(player.x + 20, player.y + 20, 20, 20);
    bullet.addImage(bulletimg);
    bullet.scale = 0.4;
    bullet.velocityX = 10;
    bullet.depth = player.depth;
    player.depth = player.depth + 1;

    bulletgroup.add(bullet);

}

function nextLevelInfoPopUp() {
    swal({
        title: "Next Level",
        text: "Unleash your next level. Kill and survive.",
        textAlign: "center",
        imageUrl: "assets/splashScreen.gif",
        imageSize: "200x200",
        confirmButtonText: "Next Level",
        confirmButtoncolor: "brown"
    },
        function () {
            gameState = "level2"
        })
}