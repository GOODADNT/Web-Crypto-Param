function initNumCalc(calcStr, startVal=0) {
    for (let i = 0; i < calcStr.length; i++) {
        startVal = ((startVal ^ calcStr.charCodeAt(i)) * 65599) >>> 0;
    }
    return startVal;
}

function getAsciiCode(num) {
    return num < 26 ? num + 65 : num < 52 ? num + 71 : num < 62 ? num - 4 : num - 17;
}


function convertToStr(num) {
    let str = '';
    const circularArray = [24, 18, 12, 6, 0];
    circularArray.forEach(function (value){
        let xNum = num >> value & 63;
        let asciiCode = getAsciiCode(xNum);
        str += String.fromCharCode(asciiCode);
    })
    return str;
}


function getAcSignature(url, ac_nonce, ua) {
    let acSignature = "_02B4Z6wo00f01";  // Fixed beginning

    let nowTime = Math.floor(Date.now() / 1000).toString();
    nowTime = '1727412787';
    let timeNum = initNumCalc(nowTime);
    let urlNum = initNumCalc(url, timeNum);
    let binaryNum = ((nowTime ^ (urlNum % 65521 * 65521)) >>> 0).toString(2);
    binaryNum = binaryNum.padStart(32, '0');
    binaryNum = "10000000110000" + binaryNum;
    let decNum = parseInt(binaryNum, 2);

    // Group I 5+5+5+1
    acSignature += convertToStr(decNum >> 2);
    acSignature += convertToStr(decNum << 28 | 515);
    acSignature += convertToStr(-1073741824 | ((1219955485 ^ decNum) >>> 6));
    const midXNum = (1219955485 ^ decNum) & 63;
    let midAsciiCode = getAsciiCode(midXNum);
    acSignature += String.fromCharCode(midAsciiCode);

    // Group II 5+5+5
    let decInitNum = initNumCalc(decNum.toString());
    let nonceNum = initNumCalc(ac_nonce, decInitNum);
    let uaNum = initNumCalc(ua, decInitNum);
    acSignature += convertToStr(((uaNum % 65521 << 16) | (nonceNum % 65521)) >> 2);
    acSignature += convertToStr((((uaNum % 65521 << 16) ^ (nonceNum % 65521)) << 28) | ((524576 ^ decNum) >>> 4));
    acSignature += convertToStr(urlNum % 65521);

    // Group III 2
    let lastNum = 0;
    for (let i of acSignature) {
        lastNum = (lastNum * 65599 + i.charCodeAt(0)) >>> 0;
    }
    let lastStr = lastNum.toString(16);
    acSignature += lastStr.slice(lastStr.length - 2, lastStr.length);

    return acSignature;
}

const args = process.argv.slice(2);
console.log(getAcSignature(args[0], args[1], args[2]));
