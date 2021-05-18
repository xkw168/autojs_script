/**
 * 蚂蚁农场 + 果树 自动化脚本
 * 1. 喂小鸡
 * 2. 领饲料
 */

// 检测无障碍服务是否打开
auto();
// 测试机: 小米10的屏幕尺寸 (width x height)
setScreenMetrics(1080, 2340);

const AD_DURATION = 20 * 1000

events.observeKey();

/**
 * 设置按键监听 当脚本执行时候按音量减 退出脚本
 */
events.onKeyDown ("volume_down", function (event) {
    toastLog("程序结束");
    exit();
});

function log (msg) {
    console.log(msg)
}

/**
 * 点击某个坐标并延迟一定时间
 * @param {点击的x坐标} x 
 * @param {点击的y坐标} y 
 */
function clickWithDelay (x, y, delay) {
    if (delay == null) {
        delay = 100;
    }
    click(x, y);
    sleep(delay);
}

/**
 * 点击某个坐标并延迟一定时间
 * @param {点击的x坐标} x 
 * @param {点击的y坐标} y 
 */
function clickPointWithDelay (point, delay) {
    if (delay == null) {
        delay = 100;
    }
    click(point.x, point.y);
    sleep(delay);
}

/**
 * 打开手机淘宝
 */
function goFarmPage () {
    if (!launchPackage("com.taobao.taobao")) {
        toastLog("无法打开手机淘宝");
        exit();
    }
    waitForActivity("com.taobao.tao.TBMainActivity");
    sleep(2000);
    var farmBtn = descContains("芭芭农场").findOne(1000);
    if (farmBtn != null) {
        farmBtn.click();
    } else {
        toastLog("无法找到芭芭农场按钮");
        exit();
    }
    waitForActivity("com.taobao.browser.BrowserActivity");
    // 等待页面加载完成
    sleep(8000);
}

function dailySignIn () {
    var signinBtn = text("去签到").findOne(1000);
    if (signinBtn != null) {
        signinBtn.click();
    } else {
        toastLog("今日已签到");
    }
    sleep(1000);
}

function watchAd () {
    var adBtn = textContains("精选好物").findOne(1000);
    if (adBtn != null) {
        adBtn.click();
        sleep(1000);
        // 滑动一下才开始计算广告时间
        swipe(500, 1500, 300, 1500, 300);
        sleep(AD_DURATION);
        backWithDelay();
    } else {
        toastLog("无广告按钮");
    }
    sleep(1000);
}

function getFer () {
    var getBtn = textContains("去领取").findOne(1000);
    if (getBtn != null) {
        getBtn.click();
    } else {
        toastLog("暂无肥料可领取");
    }
    sleep(1000);
}

/**
 * 领肥料
 */
function fertilizeTree () {
    // 点击领取饲料按钮
    var collecrCoor = {
        x: (871 + 1056) / 2,
        y: (1576 + 1761) / 2
    };
    clickPointWithDelay(collecrCoor, 1500);
    // 每日签到
    dailySignIn();
    // 观看广告
    watchAd();
    // 淘宝芭芭农场每天可以领取多次400肥料
    getFer();
}

/**
 * 通常回到上一个画面需要一定的动画时间
 */
function backWithDelay () {
    back();
    sleep(500);
}

function complete () {
    back();
    sleep(500);
    back();
    sleep(500);
    home();
    exit();
}

function main () {
    // 从主页进入芭芭农场主页
    goFarmPage();
    // 施肥，领肥料
    fertilizeTree();
    // 结束后返回主页面
    complete();
}

main();
