//服务器地址
//export const BaseUrl = 'http://10.98.165.141:8081/data-exchange';  //测试地址
export const BaseUrl = 'http://gxbhf.sirbox.cn/data-exchange';  //测试地址
//export const BaseUrl = 'http://113.12.195.41:8082/facd-platform';  //正式地址

//vlc APP 版本号：
export const VlcVersion:string = "2.0.0";//vlc APP 版本号,用于检测vlc播放器是否需要更新

//Cesium 初始化
export const LONGITUDE:number = 106.85417175292945;
export const LATITUDE:number = 22.34499936506692;
export const HEIGHT:number = 102078.132840822502;

//硬件特征码
export const TOKEN:string = "DBE281749657A98E";

//信息上报每页显示记录数，按天数算  -5表示从今天起倒推5天
export const DAYS:number = -10;

//信息上报每页显示记录数
export const ROWS:number = 16;

//龙州边境坐标-已从服务器获取
//export const LZ = [106.640883, 22.339098,106.595139, 22.340484,106.570211, 22.353136,106.56838, 22.3617,106.574982, 22.373873,106.58731, 22.380056,106.597056, 22.392442,106.595078, 22.396593,106.576792, 22.406829,106.570254, 22.429228,106.575102, 22.448958,106.567399, 22.465645,106.577325, 22.479431,106.582363, 22.482369,106.585581, 22.47851,106.587011, 22.480975,106.590172, 22.519498,106.609939, 22.568143,106.612148, 22.588137,106.609042, 22.595266,106.614373, 22.606496,106.627128, 22.615424,106.639615, 22.611436,106.654455, 22.589178,106.663515, 22.582927,106.681741, 22.581963,106.696971, 22.586274,106.720177, 22.583452,106.732252, 22.587841,106.737731, 22.607066,106.728381, 22.617043,106.737461, 22.628996,106.737649, 22.64951,106.758174, 22.669545,106.764818, 22.681002,106.765465, 22.695528,106.777247, 22.712468,106.767998, 22.721504,106.775589, 22.730807,106.780975, 22.74977,106.790181, 22.742237,106.798852, 22.745855,106.804117, 22.74372,106.806432, 22.737432,106.800691, 22.73345,106.817571, 22.720367,106.820182, 22.709062,106.83573, 22.709615,106.831198, 22.702438,106.844388, 22.694603,106.852269, 22.68233,106.865175, 22.681426,106.859997, 22.676376,106.86383, 22.671477,106.882404, 22.665186,106.88361, 22.652191,106.887747, 22.649804,106.897713, 22.653342,106.915659, 22.638512,106.919803, 22.633239,106.918103, 22.625235,106.928724, 22.62351,106.932584, 22.627334,106.939368, 22.617542,106.964263, 22.623233,106.965014, 22.61836,106.972746, 22.614389,106.978016, 22.614318,106.981907, 22.618718,106.989935, 22.61641,106.99453, 22.608713,107.020386, 22.598876,107.009965, 22.586586,107.015974, 22.570819,107.0271, 22.560965,107.027964, 22.553694,107.042999, 22.556218,107.048496, 22.544778,107.04854, 22.530354,107.059482, 22.534749,107.065336, 22.530224,107.077883, 22.529954,107.083311, 22.503755,107.098099, 22.50155,107.099818, 22.50538,107.106135, 22.502061,107.119471, 22.505883,107.11977, 22.499988,107.133084, 22.504041,107.137868, 22.492344,107.136574, 22.484325,107.142995, 22.480376,107.156668, 22.456494,107.167587, 22.457027,107.16828, 22.466619,107.177838, 22.467635,107.184433, 22.46206,107.193714, 22.464561,107.210888, 22.462805,107.208266, 22.450628,107.221079, 22.449353,107.213037, 22.439518,107.215809, 22.430882,107.21349, 22.423882,107.20097, 22.418038,107.193394, 22.408137,107.184749, 22.408709,107.173029, 22.400371,107.176136, 22.396542,107.173274, 22.388889,107.177769, 22.381681,107.171466, 22.373244,107.1584, 22.375788,107.140448, 22.371357,107.128193, 22.374545,107.123161, 22.380535,107.115167, 22.379643,107.113766, 22.37648,107.104605, 22.378846,107.103018, 22.371284,107.094964, 22.371821,107.086653, 22.355639,107.060351, 22.338323,107.062422, 22.324063,107.075851, 22.318492,107.077496, 22.310982,107.081055, 22.310616,107.085322, 22.302522,107.088012, 22.291477,107.084403, 22.284134,107.078528, 22.284685,107.069012, 22.279608,107.059051, 22.269964,107.026228, 22.262982,107.007994, 22.269774,107.009547, 22.284216,106.992077, 22.289439,107.000538, 22.279454,107.000309, 22.250115,106.992015, 22.245938,106.983817, 22.232684,106.971469, 22.223976,106.966309, 22.213693,106.956288, 22.21028,106.946476, 22.21407,106.933129, 22.206767,106.922892, 22.197749,106.925628, 22.191556,106.922332, 22.180768,106.899771, 22.163533,106.889423, 22.176321,106.883424, 22.172377,106.867432, 22.17163,106.855364, 22.156349,106.838069, 22.151512,106.820421, 22.154726,106.8142, 22.159479,106.807716, 22.158109,106.804343, 22.16373,106.789506, 22.16566,106.789414, 22.174901,106.801781, 22.177817,106.809037, 22.183377,106.810613, 22.191269,106.807416, 22.198195,106.796322, 22.194205,106.789123, 22.199202,106.771761, 22.196723,106.764733, 22.205418,106.756706, 22.19847,106.751736, 22.199846,106.747038, 22.21079,106.73811, 22.213725,106.741866, 22.222908,106.737102, 22.226828,106.73885, 22.237855,106.728683, 22.248705,106.729192, 22.263541,106.710796, 22.273888,106.698343, 22.275576,106.697038, 22.282814,106.683315, 22.284456,106.679561, 22.288291,106.665213, 22.339488,106.640883, 22.339098] ;
