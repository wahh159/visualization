import './css/index.scss'
import bezier from './main'
import data from './data'
import {getcolor,color,linecolor} from './color'
const canvas=document.getElementById('visual');
const ctx=canvas.getContext('2d');

//top theme color
let tcolor = {
    x: 150, //主题大矩形的x坐标
    y: 100, //y
    w: 10, //小矩形的宽
    h: 30, //高
    fontx: 160, //字体的x
    fonty: 120 //y
}
for (let i = 0; i < Object.values(data)[0].length; i++) {
    ctx.strokeText("主题" + (i + 1), tcolor.fontx + tcolor.x * i, tcolor.fonty);
    for (let j = 0; j < color[0].length; j++) {
        ctx.globalCompositeOperation = "destination-over" //放在源画布上，即最底层
        ctx.fillStyle = color[i][j];
        ctx.fillRect(100 + tcolor.x * i + tcolor.w * j, tcolor.y, tcolor.w, tcolor.h);
    }
}
function getallnum() {
    let allnum = [];//存每年number，即每年主题权重高度总数
    let yearh = []; //每年高度
    let yeari = 0;
    for (let [key, value] of Object.entries(data)) {
        ctx.strokeText(key, 60 + 150 * yeari, 760);
        let yearnum = value.reduce((p,c)=>p+c.number,0);//reduce 有毒
        allnum.push(yearnum);  
        yeari++;      
    }
    //每年最多的数目
    let max = Math.max.apply(this, allnum);
    //每年高度
    yearh=allnum.map((v)=>-v/max*600);
    return {allnum,max,yearh};
}
let yeardata=getallnum();
// console.log(yeardata);
//画图
let drawi=0;
let iarray=[];
for (let i in data){
    let $yeary = 750;//年的y坐标
    let $lastyeaty=750;//上一年
    let $btyeary=750;//上一个主题
    let $btlastyeary = 750;//上一年上一个主题
    iarray.push(i);
    console.log(i);
    
    for(let j in data[i]){
        //每个主题权重*高度=主题高度
        let themeh = data[i][j].number / yeardata.allnum[drawi] * yeardata.yearh[drawi];
        if(j>0){  
            let btthemeh = data[i][j-1].number / yeardata.allnum[drawi] * yeardata.yearh[drawi];
            $btyeary += btthemeh; //y轴坐标叠加主题高度
        }
        // console.log('年' + $yeary);
        // console.log('主题' + themeh);
        // ctx.strokeRect(40 + 150 * drawi, $yeary, 50, themeh)//画主题框
        $yeary += themeh;//y轴坐标叠加主题高度
        if (drawi) {  
            let lastthemeh = data[iarray[drawi - 1]][j].number / yeardata.allnum[drawi - 1] * yeardata.yearh[drawi - 1];
            $lastyeaty += lastthemeh;
            //p1,c1,c2,p2[起始点x， y]，[结束点x， 起始点y],[起始点x， 结束点y], [结束点x， y]， 获取控制点
            let p1=[50+150*(drawi-1)+50,$lastyeaty];
            let c1 = [50 + 150 * drawi, $lastyeaty];
            let c2 = [50 + 150 * (drawi - 1) + 50, $yeary];
            let p2 = [50 + 150 * drawi, $yeary];
            // let aa = twoBezier(0.5, p1, c1, p2);
            let aa = bezier.threeBezier(2/3, p1, c1,c2, p2);
            let bb = bezier.threeBezier(1/3, p1, c1, c2, p2);
            let p3 = [, $btlastyeary];
            let c3=[];
            let c4=[];
            let p4 = [, $btyeary];
            let cc=[];
            let dd=[];
            let btlastthemeh = data[iarray[drawi - 1]][j].number / yeardata.allnum[drawi - 1] * yeardata.yearh[drawi - 1];
            p3 = [50 + 150 * (drawi - 1) + 50, $btlastyeary];
            c3 = [50 + 150 * drawi, $btlastyeary];
            c4 = [50 + 150 * (drawi - 1) + 50, $btyeary];
            p4 = [50 + 150 * drawi, $btyeary];
            // let aa = twoBezier(0.5, p1, c1, p2);
            cc = bezier.threeBezier(1/3, p3, c3, c4, p4);
            dd = bezier.threeBezier(2/3, p3, c3, c4, p4);
            $btlastyeary += btlastthemeh;
            //p1<-p2
            //↓    ↑
            //p3->p4
            ctx.beginPath();
            //控制点1，控制点2，p2
            ctx.moveTo(p2[0], p2[1]); //起始x，y
            ctx.bezierCurveTo(aa[0], aa[1], bb[0], bb[1], p1[0], p1[1]);
            ctx.lineTo(p3[0], p3[1]);
            ctx.moveTo(p3[0], p3[1]);
            ctx.bezierCurveTo(cc[0], cc[1], dd[0], dd[1], p4[0], p4[1]);
            ctx.lineTo(p2[0], p2[1]);
            // console.log('p4:' + p4[1], 'p2:' + p2[1], 'p3:' + p3[1], 'p1:' + p1[1]);
            // ctx.closePath();
            ctx.globalCompositeOperation = "destination-over"//放在源画布上，即最底层
            if(p4[1]-p2[1]>=2&&p3[1]-p1[1]>=2){  
                // console.log('p4:' + p4[1], 'p2:' + p2[1], 'p3:' + p3[1], 'p1:' + p1[1]);
                if (getcolor(data[i][j].word.length).length){
                    ctx.strokeStyle=linecolor[j];
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.fillStyle = getcolor(data[i][j].word.length)[j][Math.floor(Object.values(data)[0].length / 2)];
                    ctx.fill();     
                }   
            }    
        }
        if(data[i][j].word.length){
            //存词的总权重
            let wsumnum = data[i][j].word_number.reduce((p, c) => p + c);
            // console.log(wsumnum);
            //每个词的权重*主题高度=词高度
            let wnum=data[i][j].word_number.map(v=>v/wsumnum*themeh);
            // console.log(wnum);
            let $themey=$yeary;
            // console.log($themey);
            for (let k = 0; k < data[i][j].word.length; k++) {
                $themey-=wnum[k];//y轴叠加词高度
                ctx.fillStyle = getcolor(data[i][j].word.length)[j][k];
                // ctx.fillStyle = 'rgba(' + Math.floor(255 - 50 * j) + ',' + Math.floor(255 - 50 * k) + ',0,1)';
                //x,y,宽,词高
                ctx.fillRect(50 + 150 * drawi, $themey, 50, wnum[k])
                ctx.font = "small-caps 10px arial";
                ctx.strokeStyle='black';
                ctx.lineWidth = 1;
                // ctx.fillText(data[i][j].word[k], 110 + 150 * drawi, $themey + wnum[k]/2);
                ctx.strokeText(data[i][j].word[k], 110 + 150 * drawi, $themey + wnum[k] / 2);
            }
        }
        $yeary -= 2 //间隙
        $btyeary -= 2 //间隙
        $lastyeaty -= 2;
        $btlastyeary -= 2;
    }
    drawi++;
}



