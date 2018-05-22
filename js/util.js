//日付を整形
var formatDate = function(date, formatText){
    var ret = formatText;
    var weekDayLabel = ['日','月','火','水','木','金','土',];
    try{
        if(date){
            date = new Date(date);	//文字列型で渡される場合があるので、Date型に変換
        }else{
            return '';
        }
        date.yyyy = date.getFullYear();
        date.m = date.getMonth() + 1;
        date.mm = ('0' + date.m).slice(-2);
        date.d = date.getDate();
        date.dd = ('0' + date.d).slice(-2);
        date.w = date.getDay();	//曜日（0～6）
        date.ww = weekDayLabel[date.w];	//曜日（日～土）
        date.H = date.getHours();
        date.HH = ('0' + date.H).slice(-2);
        date.M = date.getMinutes();
        date.MM = ('0' + date.M).slice(-2);
        date.S = date.getSeconds();
        date.SS = ('0' + date.S).slice(-2);
        ret = ret.split('yyyy').join(date.yyyy);
        ret = ret.split('mm').join(date.mm);
        ret = ret.split('m').join(date.m);
        ret = ret.split('dd').join(date.dd);
        ret = ret.split('d').join(date.d);
        ret = ret.split('ww').join(date.ww);
        ret = ret.split('w').join(date.w);
        ret = ret.split('HH').join(date.HH);
        ret = ret.split('H').join(date.H);
        ret = ret.split('MM').join(date.MM);
        ret = ret.split('M').join(date.M);
        ret = ret.split('SS').join(date.SS);
        ret = ret.split('S').join(date.S);
        return ret;
    }catch(err){
        alert('app.formatDate' + '\n' + err.message);
    }finally{
    }
};	
