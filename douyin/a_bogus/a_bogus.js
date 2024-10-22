function calcBase64(longStr, selectNum) {
    const strObj = {
        's0': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        's1': 'Dkdpgh4ZKsQB80/Mfvw36XI1R25+WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe=',
        's2': 'Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe=',
        's3': 'ckdp1h4ZKsUB80/Mfvw36XIgR25+WQAlEi7NLboqYTOPuzmFjJnryx9HVGDaStCe',
        's4': 'Dkdpgh2ZmsQB80/MfvV36XI1R45-WUAlEixNLwoqYTOPuzKFjJnry79HbGcaStCe'
    }

    const selectStr = strObj[selectNum];
    let resultStr = '';
    for (let i = 0; i < longStr.length; i+=3) {
        let num = ((longStr.charCodeAt(i) & 255) << 16) | ((longStr.charCodeAt(i+1) & 255) << 8) | (longStr.charCodeAt(i+2) & 255);
        resultStr += selectStr.charAt((num & 16515072) >> 18);
        resultStr += selectStr.charAt((num & 258048) >> 12);
        resultStr += selectStr.charAt((num & 4032) >> 6);
        resultStr += selectStr.charAt(num & 63);
    }
    return resultStr;
}

function rc4Encrypt(plaintext, key) {
    let sBox = [];
    for (let i = 0; i < 256; i++) {
        sBox[i] = 255 - i;
    }
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j * sBox[i] + j + key.charCodeAt(i % key.length)) % 256;
        let temp = sBox[i];
        sBox[i] = sBox[j];
        sBox[j] = temp;
    }

    let t = 0;
    let k = 0;
    let resultStr = "";
    for (let i = 0; i < plaintext.length; i++) {
        t = (i + 1) % 256;
        k = (k + sBox[t]) % 256;
        let temp = sBox[t];
        sBox[t] = sBox[k];
        sBox[k] = temp;
        resultStr += String.fromCharCode(plaintext.charCodeAt(i) ^ sBox[(sBox[t] + sBox[k]) % 256]);
    }
    return resultStr;
}

function ye(t, e) {
    return (t << (e %= 32) | t >>> 32 - e) >>> 0
}

function de(t) {
    return 0 <= t && t < 16 ? 2043430169 : 16 <= t && t < 64 ? 2055708042 : void 0
}

function me(t, e, r, n) {
    return 0 <= t && t < 16 ? (e ^ r ^ n) >>> 0 : 16 <= t && t < 64 ? (e & r | e & n | r & n) >>> 0 : 0
}

function be(t, e, r, n) {
    return 0 <= t && t < 16 ? (e ^ r ^ n) >>> 0 : 16 <= t && t < 64 ? (e & r | ~e & n) >>> 0 : 0
}

function reset() {
    this.reg[0] = 1937774191;
    this.reg[1] = 1226093241;
    this.reg[2] = 388252375;
    this.reg[3] = 3666478592;
    this.reg[4] = 2842636476;
    this.reg[5] = 372324522;
    this.reg[6] = 3817729613;
    this.reg[7] = 2969243214;
    this.chunk = [];
    this.size = 0;
}

function write(t) {
    const e = "string" == typeof t ? function (t) {
        const e = encodeURIComponent(t).replace(/%([0-9A-F]{2})/g, (function (t, e) {
                return String.fromCharCode(parseInt(e, 16))
            }
        ))
            , r = new Array(e.length);
        Array.prototype.forEach.call(e, (function (t, e) {
                r[e] = t.charCodeAt(0)
            }
        ))
        return r
    }(t) : t;
    this.size += e.length;
    let r = 64 - this.chunk.length;
    if (e.length < r)
        this.chunk = this.chunk.concat(e);
    else
        this.chunk = this.chunk.concat(e.slice(0, r));
        while (this.chunk.length >= 64) {
            this._compress(this.chunk);
            if (r < e.length) {
                this.chunk = e.slice(r, Math.min(r + 64, e.length));
            } else {
                this.chunk = [];
            }
            r += 64;
        }
}

function sum(t, e) {
    let r;
    if (t) {
        this.reset();
        this.write(t);
    }
    this._fill();
    for (r = 0; r < this.chunk.length; r += 64)
        this._compress(this.chunk.slice(r, r + 64));
    let n, o, i, u;
    if ("hex" === e) {
        u = "";
        for (r = 0; r < 8; r++) {
            n = this.reg[r].toString(16);
            o = 8;
            i = "0";
            u += n.length >= o ? n : i.repeat(o - n.length) + n;
        }
    } else
        for (u = new Array(32),
        r = 0; r < 8; r++) {
            let c = this.reg[r];
            u[4 * r + 3] = (255 & c) >>> 0;
            c >>>= 8;
            u[4 * r + 2] = (255 & c) >>> 0;
            c >>>= 8;
            u[4 * r + 1] = (255 & c) >>> 0;
            c >>>= 8;
            u[4 * r] = (255 & c) >>> 0;
        }
    this.reset();
    return u;
}

function _compress(t) {
    if (t < 64)
        console.error("compress error: not enough data");
    else {
        let r = this.reg.slice(0);
        let e = function(t) {
            let n;
            let e = new Array(132);
            let r = 0;
            for (; r < 16; r++) {
                e[r] = t[4 * r] << 24;
                e[r] |= t[4 * r + 1] << 16;
                e[r] |= t[4 * r + 2] << 8;
                e[r] |= t[4 * r + 3];
                e[r] >>>= 0;
            }
            for (n = 16; n < 68; n++) {
                let o = e[n - 16] ^ e[n - 9] ^ ye(e[n - 3], 15);
                o = o ^ ye(o, 15) ^ ye(o, 23);
                e[n] = (o ^ ye(e[n - 13], 7) ^ e[n - 6]) >>> 0;
            }
            for (n = 0; n < 64; n++)
                e[n + 68] = (e[n] ^ e[n + 4]) >>> 0;
            return e
        }(t);
        let n = 0;
        for (; n < 64; n++) {
            let o = ye(r[0], 12) + r[4] + ye(de(n), n)
                , i = ((o = ye(o = (4294967295 & o) >>> 0, 7)) ^ ye(r[0], 12)) >>> 0
                , u = me(n, r[0], r[1], r[2]);
            u = (4294967295 & (u = u + r[3] + i + e[n + 68])) >>> 0;
            let c = be(n, r[4], r[5], r[6]);
            c = (4294967295 & (c = c + r[7] + o + e[n])) >>> 0;
            r[3] = r[2];
            r[2] = ye(r[1], 9);
            r[1] = r[0];
            r[0] = u;
            r[7] = r[6];
            r[6] = ye(r[5], 19);
            r[5] = r[4];
            r[4] = (c ^ ye(c, 9) ^ ye(c, 17)) >>> 0;
        }
        for (let a = 0; a < 8; a++)
            this.reg[a] = (this.reg[a] ^ r[a]) >>> 0
    }
}

function _fill() {
    let r;
    let t = 8 * this.size
        , e = this.chunk.push(128) % 64;
    for (64 - e < 8 && (e -= 64); e < 56; e++)
        this.chunk.push(0);
    for (r = 0; r < 4; r++) {
        const n = Math.floor(t / 4294967296);
        this.chunk.push(n >>> 8 * (3 - r) & 255)
    }
    for (r = 0; r < 4; r++)
        this.chunk.push(t >>> 8 * (3 - r) & 255)
}

function SM3(){
    this.reg = new Array(8);
    this.chunk = [];
    this.size = 0;
    this.reset();
}

SM3.prototype.reset = reset;
SM3.prototype.write = write;
SM3.prototype.sum = sum;
SM3.prototype._compress = _compress;
SM3.prototype._fill = _fill;

function calcCharCode(aNum, bNum, andArray) {
    let resultStr = '';
    resultStr += String.fromCharCode(aNum & 170 | andArray[0] & 85);
    resultStr += String.fromCharCode(aNum & 85 | andArray[0] & 170);
    resultStr += String.fromCharCode(bNum & 170 | andArray[1] & 85);
    resultStr += String.fromCharCode(bNum & 85 | andArray[1] & 170);
    return resultStr;
}

function randomStrA() {
    const aNum = Math.random() * 65535 & 255;
    const bNum = Math.random() * 40 >> 0;
    return calcCharCode(aNum, bNum, [3, 82]);
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);

}

function randomArray(params_suffix, suffix, user_agent, pageId, aid) {
    let resultArray = [];
    resultArray.push(41);
    const nowTime = Date.now();
    resultArray.push((1728997317126 - 1721836800000) / 1000 / 60 / 60 / 24 / 14 >> 0);
    resultArray.push(6);
    const aTime = nowTime - randomNum(3000, 5000);
    resultArray.push(randomNum(70, 100) + 3);
    resultArray.push(aTime & 255);
    resultArray.push(aTime >> 8 & 255);
    resultArray.push(aTime >> 16 & 255);
    resultArray.push(aTime >> 24 & 255);
    resultArray.push(aTime / 256 / 256 / 256 / 256 & 255);
    let t = aTime / 256 / 256 / 256 / 256 / 256 & 255;
    resultArray.push(t);
    resultArray.push(t % 256 & 255);
    resultArray.push(t / 256 & 255);
    resultArray.push(1,0,0,0,0,0);
    t = 14;
    resultArray.push(t & 255);
    resultArray.push(t >> 8 & 255);
    resultArray.push(t >> 16 & 255);
    resultArray.push(t >> 24 & 255);
    resultArray.push(params_suffix[0]);
    resultArray.push(params_suffix[18]);
    resultArray.push(params_suffix[3]);
    resultArray.push(suffix[10]);
    resultArray.push(suffix[19]);
    resultArray.push(suffix[4]);
    resultArray.push(user_agent[11]);
    resultArray.push(user_agent[21]);
    resultArray.push(user_agent[5]);
    const bTime = aTime - randomNum(20, 50);
    resultArray.push(bTime & 255);
    resultArray.push(bTime >> 8 & 255);
    resultArray.push(bTime >> 16 & 255);
    resultArray.push(bTime >> 24 & 255);
    resultArray.push(bTime / 256 / 256 / 256 / 256 & 255);
    resultArray.push(bTime / 256 / 256 / 256 / 256 / 256 & 255);
    resultArray.push(3);
    resultArray.push(pageId & 255);
    resultArray.push(pageId >> 8 & 255);
    resultArray.push(pageId >> 16 & 255);
    resultArray.push(pageId >> 24 & 255);
    resultArray.push(aid & 255);
    resultArray.push(aid >> 8 & 255);
    resultArray.push(aid >> 16 & 255);
    resultArray.push(aid >> 24 & 255);
    resultArray.push(41 & 255);
    resultArray.push(41 >> 8 & 255);
    resultArray.push(3 & 255);
    resultArray.push(3 >> 8 & 255);
    return resultArray;
}

function randomStrCa() {
    let randomNum = Math.random() * 65535;
    const aNum = randomNum & 255;
    const bNum = randomNum >> 8;
    return calcCharCode(aNum, bNum, [1, 0]);
}

function randomStrCb() {
    let aNum = Math.random() * 240 >> 0;
    if (aNum > 109) {
        aNum += aNum % 2 + 1;
    }
    let bNum = Math.random() * 255 >> 0 & 77 | 2 | 16 | 32 | 128;
    return calcCharCode(aNum, bNum, [1, 0]);
}

function randomStrCc(numArray) {
    let resultStr = '';
    for (let i = 0; i < numArray.length; i+=3) {
        const randomNum = Math.random() * 1000 & 255;
        resultStr += String.fromCharCode(randomNum & 145 | numArray[i] & 110);
        resultStr += String.fromCharCode(randomNum & 66 | numArray[i+1] & 12);
        resultStr += String.fromCharCode(randomNum & 44 | numArray[i+2] & 211);
        resultStr += String.fromCharCode((numArray[i] & 145) & (numArray[i+1] & 66) | (numArray[i+2] & 44));
    }
    return resultStr;
}

function getArray(strCa, strCb, randomArray) {
    let resultArray = [];

    let selectNumArray = [9, 18, 28, 32, 44, 4, 41, 19, 10, 23, 12, 37, 24, 39, 3, 22, 35, 21, 5, 42, 1, 27, 6, 40, 30, 14, 33, 34, 2, 43, 15, 45, 29, 25, 16, 13, 8, 38, 26, 17, 36, 20, 11, 0, 31, 7, 46, 47, 48, 49];
    for (let i = 0; i < selectNumArray.length; i++) {
        resultArray.push(randomArray[selectNumArray[i]]);
    }

    const winPath = "1536|776|1536|864|1536|864|1536|864|Win32";
    for (let i = 0; i < winPath.length; i++) {
        resultArray.push(winPath.charCodeAt(i));
    }

    const timestamp = 1728997274461;
    const timestampStr = (timestamp + 3 & 255) + ",";
    for (let i = 0; i < timestampStr.length; i++) {
        resultArray.push(timestampStr.charCodeAt(i));
    }

    let xorNum = strCa.charCodeAt(0);
    for (let i = 1; i < strCa.length; i++) {
        xorNum ^= strCa.charCodeAt(i);
    }
    for (let i = 0; i < strCb.length; i++) {
        xorNum ^= strCb.charCodeAt(i);
    }
    for (let i = 0; i< randomArray.length; i++) {
        xorNum ^= randomArray[i];
    }
    resultArray.push(xorNum);
    return resultArray;
}

function randomStrC(urlParams, suffix, userAgent, pageId, aid) {
    let sm3 = new SM3();
    urlParams = sm3.sum(sm3.sum(urlParams + suffix));
    suffix = sm3.sum(sm3.sum(suffix));
    userAgent = sm3.sum(calcBase64(rc4Encrypt(userAgent, String.fromCharCode(1 / 256, 1, 14)), 's3'));
    const strCa = randomStrCa();
    const strCb = randomStrCb();
    const numArray = getArray(strCa, strCb, randomArray(urlParams, suffix, userAgent, pageId, aid));
    const strCc = randomStrCc(numArray);
    return strCa + strCb + strCc;
}

function randomStr(url_params, suffix, user_agent){
    let resultStr = '';
    resultStr += randomStrA();
    resultStr += rc4Encrypt(randomStrC(url_params, suffix, user_agent), String.fromCharCode(211));
    resultStr = calcBase64(resultStr, 's4');
    return resultStr;
}

const args = process.argv.slice(2);
console.log(randomStr(args[0], args[1], args[2], args[3], args[4]));