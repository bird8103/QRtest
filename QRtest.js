// ユーザーエージェントを取得
let userAgent = navigator.userAgent.toLowerCase();
// スマホかどうかを判定
let isSmartphone = /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/.test(userAgent);
// スマホかPCかに応じてデバイスのカメラ向きを決定
let camera_facing = 'user'
if (isSmartphone){camera_facing='environment'}
// HTMLのcanvas要素を取得
const QRvideo = document.getElementById('js-video')
let contentWidth;
let contentHeight;
const check_canvas = document.getElementById('js-canvas')
const ctx = check_canvas.getContext('2d')

// 利用者のデバイスがカメラ接続に対応しているかを判定
if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    // 対応しているならgetUserMediaでカメラに接続
    navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{exact:camera_facing}}})
    .then((stream)=>{QRvideo.srcObject=stream;QRvideo.onloadeddata=()=>{QRvideo.play();contentWidth=QRvideo.clientWidth;contentHeight=QRvideo.clientHeight;canvas_reset();checkImage();}})
    .catch((e)=>{console.log(e);});
    // カメラ映像のキャンバス表示
    const canvas_reset=()=>{
        check_canvas.width = contentWidth;
        check_canvas.height = contentHeight;
    }
    const checkImage=()=>{
        // 取得している動画をCanvasに描画
        ctx.drawImage(QRvideo, 0, 0, contentWidth, contentHeight)
        // Canvasからデータを取得
        const imageData=ctx.getImageData(0, 0, contentWidth, contentHeight)
        // jsQRに渡す
        const code=jsQR(imageData.data, contentWidth, contentHeight)
        // 失敗したら再度実行
        if (code) {
            alert(code.data)
            setTimeout(()=>{checkImage()}, 300)
        }else{
            console.log("未検出",code);
            setTimeout(()=>{checkImage()}, 300);
        }
    }
}else{
    alert('このデバイスではカメラ機能が使用できません');
}



