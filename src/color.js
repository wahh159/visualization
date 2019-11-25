

let linecolor = ['#ff002b', '#ff6d00', '#ffb600', '#00ffaa', '#009eff', '#ff00a4'];

let color=[
    ['#772540', '#8c2b44', '#a23148', '#b7364d', '#cd3c51', '#e24255', "#e85c6d", '#ee7686', '#f3919e', '#f9abb7', '#ffc5cf'],
    ['#5e0a0a', '#7e2411', '#9e3e18', '#bf5820', '#df7227', '#ff8c2e', '#fd9e4c', '#fcb16b', '#fac389', '#f9d6a8', '#f7r8c6'],
    ['#664114', '#724e19', '#7e5c1d', '#8b6922', '#977726', '#a3842b', '#b19a4b', '#bfb06b', '#cdc68c', '#dbdcac', '#e9f2cc'],
    ['#0c6847', '#117653', '#16845f', '#1b936c', '#20a178', '#25af84', '#49be9d', '#6ccdb5', '#90ddce', '#b3ece6', '#d7fbff'],
    ['#0c4066', '#114a74', '#175481', '#1c5e8f', '#22689c', '#2772aa', '#4e8bb8', '#75a4c7', '#9bbed5', '#c2d7e4', '#e9f0f2'],
    ['#6d257a', '#842b82', '#9b318a', '#b2318a', '#c93e99', '#e044a1', '#e65eb2', '#ec78c2', '#f393d3', '#f9ade3', '#ffc7f4']
]
function getcolor(len) {
    let colorcp=[];
    switch (len) {
        case 1:
            colorcp=color.map((v)=>{                
                return v[5];
            })
            break;
        case 2:
            colorcp = color.map((v) => {
                return [v[3],v[7]];
            })
            break;
        case 3:
            colorcp = color.map((v) => {
                return [v[3],v[5], v[7]];
            })
            break;
        case 4:
            colorcp = color.map((v) => {
                return [v[3], v[5], v[7],v[10]];
            })
            break;
        case 5:
            colorcp = color.map((v) => {
                return [v[0],v[3], v[5], v[7], v[10]];
            })
            break;
        case 6:
            colorcp = color.map((v) => {
                return [v[0], v[3], v[5],v[6], v[7], v[10]];
            })
            break;
        case 7:
            colorcp = color.map((v) => {
                return [v[0], v[3],v[4], v[5], v[6], v[7], v[10]];
            })
            break;
        case 8:
            colorcp = color.map((v) => {
                return [v[0], v[3], v[4], v[5], v[6], v[7],v[8], v[10]];
            })
            break;
        case 9:
            colorcp = color.map((v) => {
                return [v[0],v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[10]];
            })
            break;
        case 10:
            colorcp = color.map((v) => {
                return [v[0], v[2], v[3], v[4], v[5], v[6], v[7], v[8],v[9], v[10]];
            })
            break;
        case 11:
            colorcp = color.map((v) => {
                return [v[0],v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10]];
            })
            break;
        default:
            break;
    }
    return colorcp;
}
export  {getcolor,color,linecolor};