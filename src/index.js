import './css/index.scss'
import bezier from './main'
import data from './data'
import {getcolor,color,linecolor} from './color'
const canvas=document.getElementById('visual');
const ctx=canvas.getContext('2d');
const canvaswidth = canvas.width;
const canvasheight = canvas.height;


const params = {
    tenw: canvaswidth / 120,//10
    tenh: canvasheight / 80,
    fiftyw: canvaswidth / 24,//50
    fiftyh: canvasheight / 16,
    hundredw: canvaswidth / 12,//100
    hundredh: canvasheight / 8,
    hfw: canvaswidth / 8,//150
}
//top theme color
let tcolor = {
    x: params.hfw, //主题大矩形的x坐标150
    y: params.hundredh, //y100
    w: params.tenw, //小矩形的宽10
    h: params.tenh*3, //高30
    fontx: params.tenw * 16, //字体的x160
    fonty: params.tenh * 12 //y120
}
for (let i = 0; i < Object.values(data)[0].length; i++) {
    ctx.strokeText("主题" + (i + 1), tcolor.fontx + tcolor.x * i, tcolor.fonty);
    for (let j = 0; j < color[0].length; j++) {
        ctx.globalCompositeOperation = "destination-over" //放在源画布上，即最底层
        ctx.fillStyle = color[i][j];
        ctx.fillRect(params.hundredw + tcolor.x * i + tcolor.w * j, tcolor.y, tcolor.w, tcolor.h);
    }
}


function getallnum() {
    let allnum = [];//存每年number，即每年主题权重高度总数
    let yearh = []; //每年高度
    let yeari = 0;
    for (let [key, value] of Object.entries(data)) {
        ctx.strokeText(key, params.tenw*6 + params.hfw * yeari, params.tenh*76);
        let yearnum = value.reduce((p,c)=>p+c.number,0);//reduce 有毒
        allnum.push(yearnum);  
        yeari++;      
    }
    //每年最多的数目
    let max = Math.max.apply(this, allnum);
    //每年高度
    yearh=allnum.map((v)=>-v/max*params.hundredh*6);
    return {allnum,max,yearh};
}
let yeardata=getallnum();
// console.log(yeardata);
//画图
let drawi=0;
let iarray=[];//年
let ordinatedata={};//坐标数据
for (let i in data){
    //年,上一年,上一个主题,上一年上一个主题   的y坐标
    let [$yeary, $lastyeaty, $btyeary, $btlastyeary] = [params.tenh * 75, params.tenh * 75, params.tenh * 75, params.tenh * 75];
    iarray.push(i);
    // console.log(i);
    ordinatedata[i]=[];

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

            //params.fiftyw,params.hfw

            let p1 = [params.fiftyw + params.hfw * (drawi - 1) + params.fiftyw, $lastyeaty];
            let c1 = [params.fiftyw + params.hfw * drawi, $lastyeaty];
            let c2 = [params.fiftyw + params.hfw * (drawi - 1) + params.fiftyw, $yeary];
            let p2 = [params.fiftyw + params.hfw * drawi, $yeary];
            let aa = bezier.threeBezier(2/3, p1, c1,c2, p2);
            let bb = bezier.threeBezier(1/3, p1, c1, c2, p2);
            let p3 = [, $btlastyeary];
            let c3=[];
            let c4=[];
            let p4 = [, $btyeary];
            let cc=[];
            let dd=[];
            let btlastthemeh = data[iarray[drawi - 1]][j].number / yeardata.allnum[drawi - 1] * yeardata.yearh[drawi - 1];
            p3 = [params.fiftyw + params.hfw * (drawi - 1) + params.fiftyw, $btlastyeary];
            c3 = [params.fiftyw + params.hfw * drawi, $btlastyeary];
            c4 = [params.fiftyw + params.hfw * (drawi - 1) + params.fiftyw, $btyeary];
            p4 = [params.fiftyw + params.hfw * drawi, $btyeary];
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
        ordinatedata[i].push([]);
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
                ctx.fillRect(params.fiftyw + params.hfw * drawi, $themey, params.fiftyw, wnum[k]);
                ordinatedata[i][j].push({
                    'x': params.fiftyw + params.hfw * drawi,
                    'y': $themey,
                    'width': params.fiftyw,
                    'height': wnum[k]
                })
                ctx.font = "small-caps 10px arial";
                ctx.strokeStyle='black';
                ctx.lineWidth = 1;
                // ctx.fillText(data[i][j].word[k], 110 + 150 * drawi, $themey + wnum[k]/2);
                ctx.strokeText(data[i][j].word[k], params.tenw*11 + params.hfw * drawi, $themey + wnum[k] / 2);
            }
        }
        $yeary -= canvasheight/400 //间隙
        $btyeary -= canvasheight / 400 //间隙
        $lastyeaty -= canvasheight / 400;
        $btlastyeary -= canvasheight / 400;
    }
    drawi++;
}

//保存状态
//可以用年坐标交互，获取mouseover的坐标和canvas坐标转换，然后看鼠标在ordinatedata的哪个矩形范围，然后这个矩形的imdata改变
//上面可以存矩形的word_number显示出来
//mouseleave恢复状态
// let imdata=ctx.getImageData(600, 600, 10, 10);
// console.log(imdata);
// ctx.putImageData(imdata, 0,0);

console.log(ordinatedata);
//存画好的canvas数据
let canvasdata = ctx.getImageData(0, 0, canvaswidth, canvasheight);
//高亮
function lightImage(image, x, y, light) {
        // 获取从x、y开始，宽为image.width、高为image.height的图片数据
        // 也就是获取绘制的图片数据
        let imgData = ctx.getImageData(x, y, image.width, image.height);
        for (let i = 0, len = imgData.data.length; i < len; i += 4) {
            // 改变每个像素的R、G、B值
            // imgData.data[i + 0] = imgData.data[i + 0] * light;
            // imgData.data[i + 1] = imgData.data[i + 1] * light;
            // imgData.data[i + 2] = imgData.data[i + 2] * light;
            imgData.data[i + 3] = imgData.data[i + 3] * light;
        }
        // 将获取的图片数据放回去。
        // console.log(imgData);
        
        ctx.putImageData(imgData, x, y + image.height);
        
    }

canvas.addEventListener('mousemove',function (e) {
    for(let i in ordinatedata){
        let jindex=0;
        for(let j of ordinatedata[i]){
            let kindex=0;
            if (j.length){
                for(let k of j){
                    //判断鼠标在不在矩形里面
                    if (k.x < e.offsetX && k.x+k.width>e.offsetX && k.y>e.offsetY && k.y+k.height<e.offsetY){
                        ctx.clearRect(0, 0, canvaswidth, canvasheight); //清空canvas
                        ctx.putImageData(canvasdata, 0, 0);//用存好的canvas恢复状态
                        // let imdata = ctx.getImageData(k.x, k.y, k.width, k.height);
                        // ctx.putImageData(imdata, 50, 0);
                        lightImage(k, k.x, k.y, 0.5);
                        // console.log(imdata);
                        //画值
                        // ctx.strokeText(data[i][jindex].word[kindex], 0, 10);
                        // ctx.strokeText(data[i][jindex].word_number[kindex], 100, 10);
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.strokeText(data[i][jindex].word_number[kindex], k.x - params.fiftyw, k.y + k.height / 2);
                        break;
                    }
                    kindex++;
                }
            }
            jindex++; 
        }
    }
})
canvas.addEventListener('mouseout',()=>{
    ctx.putImageData(canvasdata, 0, 0);
})


