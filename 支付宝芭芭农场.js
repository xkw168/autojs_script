/**
 * 蚂蚁农场 + 果树 自动化脚本
 * 1. 喂小鸡
 * 2. 领饲料
 */

// 检测无障碍服务是否打开
auto();
// 测试机: 红米K40的屏幕尺寸 (width x height)
setScreenMetrics(1080, 2400);

// 广告等待时长 (多等5秒以防万一)
const AD_DURATION = 20 * 1000
// 芭芭农场
const farmTree = { x: 100, y: 1240 };
// 领取肥料
const getFertilizerBtn = { x: 950, y: 1945 };
// 领取肥料界面按钮
// signInY: 每日签到饲料
// chickY: 庄园小鸡饲料
// adY: 看广告拿饲料
const fertilizerBtn = { 
    x: 900, 
    signInY: 1076, 
    chickY: 1850, 
    adY: 1060 
};

events.observeKey();

/**
 * 设置按键监听 当脚本执行时候按音量减 退出脚本
 */
events.onKeyDown("volume_down", function (event) {
    toastLog("程序结束");
    exit();
});

function log(msg) {
    console.log(msg)
}

/**
 * 点击某个坐标并延迟一定时间
 * @param {点击的x坐标} x 
 * @param {点击的y坐标} y 
 */
function clickWithDelay(x, y, delay) {
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
    clickWithDelay(point.x, point.y, delay);
}


/**
 * 点击某个组件(UIObject)
 * @param {UISelector返回的组件对象} obj
 * @param {延迟} delay
 */
function clickObjWithDelay (obj, delay) {
    var b = obj.bounds();
    clickWithDelay (b.centerX(), b.centerY(), delay);
}

/**
 * 打开支付宝，并通过蚂蚁森林进入芭芭农场
 */
function goBBFarmPage() {
    launchApp("Alipay");
    waitForActivity("com.eg.android.AlipayGphone.AlipayLogin")
    sleep(1000);
    var bbfarmText = text("BABA Farm").findOne(1000);
    if (bbfarmText != null) {
        bbfarmText.parent().parent().click();
    } else {
        log("无法找到芭芭农场按钮");
        exit();
    }
    sleep(1000);
    // 修改支付宝首页添加“芭芭农场”按钮后不需要这么麻烦了
    /*
    var antFarmText = text("Ant Farm").findOne(1000);
    if (antFarmText != null) {
        clickObjWithDelay (antFarmText);
    } else {
        log("无法找到蚂蚁农场按钮");
        exit();
    }
    // 等待页面加载完成
    sleep(3000);
    // 点击芭芭农场那棵树
    clickPointWithDelay(farmTree);
    // 等待芭芭农场加载完成
    textContains("合种更快").waitFor();
    // text("合种更快").findOne(5000);
    sleep(1000);
    */
}

// 每日饲料可以多次点击（无副作用）
function getDailyFertilize() {
    var dailyBtn = text("已领取").findOne(1000);
    if (dailyBtn == null) {
        clickWithDelay(fertilizerBtn.x, fertilizerBtn.signInY, 1500);
    } else {
        toastLog("已领取每日肥料");
    }
}

// 观看广告
function watchAd() {
    let swipeDurtaion = 500
    // 先找到广告那栏的文字
    var text = textContains("看精选商品").findOnce()
    // 如果当前屏幕找不到则滑动
    if (text == null) {
        // 向上滑动显示广告选项
        // (x1, y1, x2, y2, duration)
        swipe(300, 1900, 300, 200, swipeDurtaion);
        // wait the swipe action to finish
        sleep(swipeDurtaion + 300);
        text = textContains("看精选商品").findOnce()
    }
    if (text == null) {
        toastLog("无法找到广告按钮")
    }
    // 计算出广告按钮的Y坐标
    var b = text.bounds()
    var coordY = b.top + b.height()
    // 可以观看三次广告
    var i = 0;
    while (i < 3) {
        clickWithDelay(fertilizerBtn.x, coordY);
        // 等待广告页面加载完成
        sleep(1500);
        // 任意滑动开始观看广告倒计时
        swipe(300, 1900, 300, 200, swipeDurtaion);
        sleep(AD_DURATION);
        backWithDelay();
        toastLog("看完" + (i + 1) + "次广告");
        i++;
    }
    backWithDelay();
}

// 领取小鸡生产的饲料
function getChickenFertilize() {
    var text = textContains("蚂蚁庄园小鸡").findOnce()
    if (text == null) {
        toastLog("无法找到小鸡饲料按钮")
    }
    // 计算出领取按钮的Y坐标
    var b = text.bounds()
    var coordY = b.top + b.height()
    clickWithDelay(fertilizerBtn.x, coordY, 1500);
}

/**
 * 领肥料
 */
function fertilizeTree() {
    // 点击领取饲料按钮
    clickPointWithDelay(getFertilizerBtn, 1500);
    // 领取每日签到饲料
    getDailyFertilize();
    // 蚂蚁庄园小鸡饲料
    getChickenFertilize();
    // 看广告饲料
    watchAd();
}

/**
 * 通常回到上一个画面需要一定的动画时间
 */
function backWithDelay() {
    back();
    sleep(500);
}

function complete() {
    back();
    sleep(500);
    back();
    sleep(500);
    home();
    exit();
}

function main() {
    // 打开芭芭农场
    goBBFarmPage();
    // 施肥，领肥料
    fertilizeTree();
    // 结束后返回主页面
    complete();
}

main();
