
/**
 * util模块
 * 1.isAndroid : 是否是安卓 function()
 * 2.isIos : 是否是ios function()
 * 3.isWeixin : 是否是微信 function()
 * 4.getLastStep : 获取最新流程 function()
 * 5.formatDate : 格式化日期格式 function(date,format)
 * 6.getQueryString : 获取url串参数 function(name, str)
 */

export default {
  isAndroid(){
    return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1 //android终端
  },
  isIos(){
    return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  },
  isWeixin(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
      return true//微信返回true
    }
    return false
  },
  /**
  * 从类似key=value&key1=value1串中获取参数
  * @param  {[type]} name [字段名]
  * @param  {[type]} str  [要解析的串]
  * @return {[type]}      [description]
  */
  getQueryString(name, str) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = str.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
          return ''; 
  },
  /*旋转图片*/
  rotateImg (img, direction,canvas) {
    //最小与最大旋转方向，图片旋转4次后回到原方向    
    const min_step = 0;
    const max_step = 3;
    if (img == null)return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
    let height = img.height;
    let width = img.width;
    let step = 2;
    if (step == null) {
      step = min_step;
    }
    if (direction == 'right') {
      step++;
      //旋转到原位置，即超过最大值    
      step > max_step && (step = min_step);
    } else {
      step--;
      step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数    
    let degree = step * 90 * Math.PI / 180;
    let ctx = canvas.getContext('2d');
    switch (step) {
      case 0:
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
        break;
      case 1:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, 0, -height);
        break;
      case 2:
        canvas.width = width;
        canvas.height = height;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, -height);
        break;
      case 3:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, 0);
        break;
    }
  },
  /*
  * 压缩图片
  * img : Image
  * Orientation : 
  * */
  compress(img, Orientation, max_ratio, changeOri) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    //瓦片canvas
    let tCanvas = document.createElement("canvas");
    let tctx = tCanvas.getContext("2d");
    let initSize = img.src.length;
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    let rate = 0.1 // 压缩比例
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio;
    let _r = max_ratio * 10000
    if ((ratio = width * height / _r) > 1) {
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    let count;
    if ((count = width * height / 1000000) > 1) {
      count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
      //            计算每块瓦片的宽和高
      let nw = ~~(width / count);
      let nh = ~~(height / count);
      tCanvas.width = nw;
      tCanvas.height = nh;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
      if(ratio==1){
        rate = 0.2
      }
    }
    //修复ios上传图片的时候 被旋转的问题
    if(changeOri && Orientation != "" && Orientation != 1){
      switch(Orientation){
        case 6://需要顺时针（向左）90度旋转
          this.rotateImg(img,'left',canvas);
          break;
        case 8://需要逆时针（向右）90度旋转
          this.rotateImg(img,'right',canvas);
          break;
        case 3://需要180度旋转
          this.rotateImg(img,'right',canvas);//转两次
          this.rotateImg(img,'right',canvas);
          break;
      }
    }
    //进行最小压缩
    let ndata = canvas.toDataURL('image/jpeg', rate);
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    //ndata = this.urlDatatoBlobFile(ndata)
    console.log('压缩后文件大小:',this.urlDatatoBlobFile(ndata).size / 1024)
    return ndata;
  },
  urlDatatoBlobFile(urlData) {//将base64转换为文件
    var type = urlData.split(';')[0]
    type = type.split(':')[1]
    var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  

    //处理异常,将ascii码小于0的转换为大于0  
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return this.blobToFile(new Blob( [ab] , {type : type}),'attachment');
  },
  blobToFile(blob, fileName){
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
  },
  checkIdcard(zjlx,idcard) {
    if(zjlx=='00'){
      var Errors = new Array("验证通过!", "请输入合法的证件号码或位数不对!", "证件号码出生日期超出范围或含有非法字符!",
        "证件号码校验错误!", "证件号码地区非法!");
      var area = {
        11 : "北京",
        12 : "天津",
        13 : "河北",
        14 : "山西",
        15 : "内蒙古",
        21 : "辽宁",
        22 : "吉林",
        23 : "黑龙江",
        31 : "上海",
        32 : "江苏",
        33 : "浙江",
        34 : "安徽",
        35 : "福建",
        36 : "江西",
        37 : "山东",
        41 : "河南",
        42 : "湖北",
        43 : "湖南",
        44 : "广东",
        45 : "广西",
        46 : "海南",
        50 : "重庆",
        51 : "四川",
        52 : "贵州",
        53 : "云南",
        54 : "西藏",
        61 : "陕西",
        62 : "甘肃",
        63 : "青海",
        64 : "宁夏",
        65 : "新疆",
        71 : "台湾",
        81 : "香港",
        82 : "澳门",
        91 : "国外"
      }
      var idcard, Y, JYM;
      var S, M;

      var idcard_array = new Array();
      idcard_array = idcard.split("");
      // 地区检验
      if (area[parseInt(idcard.substr(0, 2))] == null) {
        return Errors[4];
      }
      var birthdayValue = ''
      // 身份号码位数及格式检验
      switch (idcard.length) {
        case 15 :
          //获取15位身份证出生日期
          birthdayValue = idcard.charAt(6) + idcard.charAt(7);
          if(parseInt(birthdayValue) < 10) {
            birthdayValue = '20' + birthdayValue;
          }else{
            birthdayValue = '19' + birthdayValue;
          }

          birthdayValue = birthdayValue+'-'+idcard.charAt(8)+idcard.charAt(9)+'-'+idcard.charAt(10)+idcard.charAt(11);


          if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0
            || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard
                .substr(6, 2)) + 1900)
              % 4 == 0)) {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;// 测试出生日期的合法性
          } else {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;// 测试出生日期的合法性
          }
          if (ereg.test(idcard)) {
            return true;
          }else {
            return Errors[2];
            break;
          }
        case 18 :

          //获取18位身份证号码出生日期

          birthdayValue = idcard.charAt(6)+idcard.charAt(7)+idcard.charAt(8)+idcard.charAt(9)+'-'+idcard.charAt(10)+idcard.charAt(11)+'-'+idcard.charAt(12)+idcard.charAt(13);
          //20160216 身份证出生日期在18-80岁之间的检测
          var aTemp = birthdayValue.split('-');
          var sY = parseInt(aTemp[0],10);
          var sM = parseInt(aTemp[1],10) - 1;
          var sD = parseInt(aTemp[2],10);
          var dSelDate = new Date();
          dSelDate.setFullYear(sY,sM,sD);
          if(dSelDate > new Date())
          {
            var oCsrq = Ext.getCmp('csrq');
            oCsrq.setValue('');
            oCsrq.initialConfig.rawValue = '';
            return Errors[2];
          }
          else if(sY<new Date().getFullYear()-80||sY>new Date().getFullYear()-18){
            var oCsrq = Ext.getCmp('csrq');
            oCsrq.setValue('');
            oCsrq.initialConfig.rawValue = '';
            return Errors[2];
          }else{
            return true;
          }

          // 18位身份号码检测
          // 出生日期的合法性检查
          // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
          // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
          if (parseInt(idcard.substr(6, 4)) % 4 == 0
            || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard
                .substr(6, 4))
              % 4 == 0)) {
            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年出生日期的合法性正则表达式
          } else {
            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年出生日期的合法性正则表达式
          }
          if (ereg.test(idcard)) {
            return true;
          }
          else {
            return Errors[2];
            break;
          }
        default :
          return Errors[1];
          break;
      }
      return true;
    }else{
      //20160129
      if(zjlx=='03'){
        if(idcard.length!=9){
          //showError('您输入的证件号码不正确！',false);
          return "您输入的证件号码不正确！";
        }
      }
      if(idcard.length>=0 || idcard.length<=30){
        return true;
      }else{
        return "您输入的证件号码过长！";
      }
    }
    return true;
  },
}
