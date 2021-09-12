// 检测无障碍服务是否打开
auto();
// 测试机: 红米K40的屏幕尺寸 (width x height)
setScreenMetrics(1080, 2400);

// 更多能量按钮
const findEnergyBtn = { x: 960, y: 1555 };
// 收取能量的基准线（上下波动50）
const energyBasicLine = { x: 220, y: 700 };
// 有些玩家会有装扮，点到装扮会弹出一个窗口，该坐标为取消坐标
const cancelTree = { x: 540, y: 1836 };

//启用按键监听
events.observeKey();
//监听音量上键按下
events.onKeyDown("volume_down", function (event) {
    log("脚本手动退出");
    exit();
});

function log(msg) {
    toast(msg);
    console.log(msg)
}

/**
 * 点击某个坐标并延迟一定时间
 * @param {点击的x坐标} x 
 * @param {点击的y坐标} y 
 */
function clickWithDelay(x, y) {
    click(x, y);
    sleep(100);
}

/**
 * 收取当前页面的所有能量
 */
function collectEnergy(withCancel) {
    // 以该坐标为水平基准线，每个x值，分别点击+-50 y三次
    var x = energyBasicLine.x;
    var y = energyBasicLine.y;
    while (x <= 900) {
        clickWithDelay(x, y - 50);
        clickWithDelay(x, y);
        clickWithDelay(x, y + 50);
        x += 120;
        if (withCancel) {
            clickWithDelay(cancelTree.x, cancelTree.y);
        }
    }
}

/**
 * 打开支付宝，并进入蚂蚁森林我的主页
 */
function enterMyMainPage() {
    launchApp("Alipay");
    sleep(2000);
    var antForestText = text("Ant Forest").findOne(1000);
    if (antForestText != null) {
        antForestText.parent().click();
    } else {
        log("无法找到蚂蚁森林按钮");
        exit();
    }
    // 等待自己页面加载完成 (findOne会阻塞直到找到)
    text("找能量").findOne();
    sleep(500);
}

/**
 * 判断是否已经收取完所有的能量
 */
function isFinish() {
    var finish = textContains("返回").findOnce();
    if (finish != null) {
        // 已收完所有能量
        finish.click();
        sleep(1500);
    }
    return finish != null;
}

/**
 * 不断点击“找能量”按钮，收取每个好友的能量
 */
function collectFriendEnergy() {
    while (true) {
        // 好友界面的"找能量"按钮无法识别，使用绝对坐标
        clickWithDelay(findEnergyBtn.x, findEnergyBtn.y);
        // 等待页面加载完成
        sleep(1500);
        // 检查是否是结束页面
        if (isFinish()) {
            break;
        }
        // 收集好友能量
        collectEnergy(true);
    }
}

function complete () {
    back();
    sleep(500);
    back();
    sleep(500);
    home();
    exit();
}

function main() {
    // 从主页进入蚂蚁森林主页
    enterMyMainPage();
    // 收集自己的能量
    log("收集自己能量");
    collectEnergy(false);
    // 收集好友的能量
    log("收集好友能量");
    collectFriendEnergy();
    log("完成");
    // 结束后返回主页面
    complete();
}

main();