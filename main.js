'use strict';

// バイアス解説ページを表示する処理
function openSection(sectionId) {
  // 全てのセクションを非表示にする
  var allSections = document.querySelectorAll('section');
  allSections.forEach(function(section) {
      section.style.display = 'none';
  });

  // 選択されたセクションを表示する
  var selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
      selectedSection.style.display = 'block';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var clickCounts = {};
  var counts = {};

  var canall = 0;
  var cana = 0;
  var canb = 0;
  var canc = 0;
  var cand = 0;
  var cane = 0;

  // 30分のミリ秒数
const tenMinutes = 30 * 60 * 1000;

// ページロード時にタイマーをセット
const reloadTimer = setTimeout(() => {
    // ページをリロード
    location.reload();
}, tenMinutes);

// ページがアンロードされる（例: 別のページに遷移する）場合にタイマーをクリア
window.addEventListener('beforeunload', () => {
    clearTimeout(reloadTimer);
});

  initializeSections();

  function initializeSections() {
    var checkboxClicked = false; // ここでcheckboxClickedを定義

    for (var i = 1; i <= 9; i++) {
      initializeClickCounts('que' + ('0' + i).slice(-2));
      addClickHandlers('que' + ('0' + i).slice(-2));
    }

    // 初期表示するセクションのIDを設定
    var currentSectionId = 'que00';
    showSection(currentSectionId);

    // 各セクションのボタンにクリックイベントを追加
    for (var i = 1; i <= 9; i++) {
      var btnId = 'btn' + ('0' + i).slice(-2);
      var sectionId = 'que' + ('0' + i).slice(-2);

      var btn = document.getElementById(btnId);
      if (btn) {
        // createClickListener 関数を initializeSections 内で定義
        function createClickListener(sectionId, btnId) {
          return function (event) {
            // クリックされたボタンに応じて対応するセクションを表示
            console.log("クリックされたボタンのID:", btnId);
            console.log("表示されるセクションのID:", sectionId);

            // チェックボックスがクリックされているか確認
            if (canShowSection(sectionId, btnId)) {
              showSection(sectionId);
            } else {
              // チェックボックスがないque00+1カウントで、かつbtn01がクリックされた場合
              if (sectionId === 'que01' && btnId === 'btn01') {
                showSection('que02');
              } else {
                console.error("エラー: チェックボックスがクリックされていません");
                if (sectionId === 'que01') {
                  alert("que01にはチェックボックスが存在しません。");
                } else {
                  alert("チェックボックスを1つ以上クリックしてください。");
                }
              }
            }
          };
        }

        btn.addEventListener('click', createClickListener(sectionId, btnId));
      } else {
        console.error('エラー: ボタンが見つかりません - ' + btnId);
      }
    }
  }

  function canShowSection(sectionId, btnId) {
    // que00+1カウントの場合はbtn00がクリックされている場合のみtrueを返す
    if (sectionId === 'que01') {
      return btnId === 'btn01'; // btn01がクリックされたときだけtrue
    }

    // que00+1カウント以外のセクションはチェックボックスがクリックされているか確認
    var biases = ['biasa', 'biasb', 'biasc', 'biasd', 'biase'];
    var checkboxClicked = false;

    for (var i = 1; i <= 8; i++) {
      for (var j = 0; j < biases.length; j++) {
        var id = biases[j] + ('0' + i).slice(-2);
        var element = document.getElementById(id);

        // クリックされたボタンが対象のセクションと一致し、かつチェックボックスがクリックされた場合
        if (element && clickCounts[id] && sectionId === 'que' + ('0' + (i + 1)).slice(-2) && btnId === 'btn' + ('0' + (i + 1)).slice(-2)) {
        checkboxClicked = true;
        }
      }
    }
    console.log('セクション', sectionId, 'ボタン', btnId, 'チェックボックスクリック済み:', checkboxClicked);
    return checkboxClicked;
  }

  function showSection(sectionId) {
    // 一旦すべてのセクションを非表示にする
    var sections = document.querySelectorAll('section');
    sections.forEach(function (section) {
      section.style.display = 'none';
    });

    // 指定されたセクションのみを表示する
    var targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
    } else {
      console.error("エラー: セクションが見つかりません - " + sectionId);
    }
  }

  function initializeClickCounts(queId) {
    // 各biasの初期化
    var biases = ['biasa', 'biasb', 'biasc', 'biasd', 'biase'];

    biases.forEach(function (bias) {
      counts[bias] = 0;
    });
  }

  function addClickHandlers(queId) {
    // 各セクション内のクリック対象のIDを生成
    var biases = ['biasa', 'biasb', 'biasc', 'biasd', 'biase'];
    var section = document.getElementById(queId);

    if (section) {
      biases.forEach(function (bias) {
        for (var i = 1; i <= 8; i++) {
          var id = bias + ('0' + i).slice(-2);
          var element = document.getElementById(id);

          if (element) {
            element.addEventListener('click', function (event) {
              // クリックされたbiasのカウントを1加算（初回クリックのみ）
              if (!clickCounts[event.target.id]) {
                clickCounts[event.target.id] = true;
                counts[bias]++;
                console.log(event.target.id + 'のクリック合計数は1回目です');
                console.log(bias + 'のクリック合計数は' + counts[bias] + '回目です');
              }
            });
          } else {
            console.error('エラー: IDが ' + id + ' の要素が見つかりません');
          }
        }
      });
    } else {
      console.error('エラー: IDが ' + queId + ' のセクションが見つかりません');
    }
  }

// 円グラフを描画する関数
function drawPieChart() {
  // クリック合計数の計算
  canall = counts.biasa + counts.biasb + counts.biasc + counts.biasd + counts.biase;
  console.log("★クリック合計総数は" + canall + "回です");

  // 各項目ごとのパーセントを計算
  cana = (counts.biasa / canall) * 100;
  canb = (counts.biasb / canall) * 100;
  canc = (counts.biasc / canall) * 100;
  cand = (counts.biasd / canall) * 100;
  cane = (counts.biase / canall) * 100;
  console.log("★canaのパーセントは" + cana + "です");
  console.log("★canbのパーセントは" + canb + "です");
  console.log("★cancのパーセントは" + canc + "です");
  console.log("★candのパーセントは" + cand + "です");
  console.log("★caneのパーセントは" + cane + "です");

  // キャンバス要素とコンテキストを取得
  var canvas = document.getElementById('mycanvas');
  var context = canvas.getContext('2d');

  // ドーナツグラフの中心座標と半径を設定
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  let outerRadius = 150;
  let innerRadius = 100;

  // 各セクションの角度と色を定義
  let canap = (cana / 100) * 360;
  let canbp = (canb / 100) * 360;
  let cancp = (canc / 100) * 360;
  let candp = (cand / 100) * 360;
  let canep = (cane / 100) * 360;
  console.log("canap:", canap);
  console.log("canbp:", canbp);
  console.log("cancp:", cancp);
  console.log("candp:", candp);
  console.log("canep:", canep);

  let sections = [
    { percentage: canap, color: '#F0908D' },
    { percentage: canbp, color: '#DEB068' },
    { percentage: cancp, color: '#80ABA9' },
    { percentage: candp, color: '#AF94C0' },
    { percentage: canep, color: '#89A1EB' },
  ];

  // 合計パーセンテージの計算
  let totalPercentage = sections.reduce((sum, section) => sum + section.percentage, 0);
  // 開始角度と終了角度の初期化
  let startAngle = -Math.PI / 2; // -π/2 から始めることで12時の位置から描画される
  let endAngle = 0;

  // 各セクションを描画
  sections.forEach(function (section) {
    endAngle = startAngle + (section.percentage / totalPercentage) * (Math.PI * 2);

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    context.closePath();

    context.fillStyle = section.color;
    context.fill();

    startAngle = endAngle;
  });

  // 画面にテキストを表示する要素を取得
  var resultTextElement = document.getElementById('resultText');

  // テキストを作成
  var resultText =
    "<span style='color: #AB6765; font-size: 30px; font-weight: bold;'>権威バイアス</span>" + "<span style='color: #000; font-size: 30px; font-weight: bold;'>＝" + Math.round(cana) + "％</span><br>" +
    "<span style='color: #C9A15F; font-size: 30px; font-weight: bold;'>希少性バイアス</span>" + "<span style='color: #000; font-size: 30px; font-weight: bold;'>＝" + Math.round(canb) + "％</span><br>" +
    "<span style='color: #78A19F; font-size: 30px; font-weight: bold;'>確証バイアス</span>" + "<span style='color: #000; font-size: 30px; font-weight: bold;'>＝" + Math.round(canc) + "％</span><br>" +
    "<span style='color: #9982A8; font-size: 30px; font-weight: bold;'>内集団・外集団バイアス</span>" + "<span style='color: #000; font-size: 30px; font-weight: bold;'>＝" + Math.round(cand) + "％</span><br>" +
    "<span style='color: #768CCC; font-size: 30px; font-weight: bold;'>現状維持バイアス</span>" + "<span style='color: #000; font-size: 30px; font-weight: bold;'>＝" + Math.round(cane) + "％</span>";

  // 画面にテキストを挿入
  resultTextElement.innerHTML = resultText;
}

// ボタン(btn09)がクリックされた時の処理
var btn09 = document.getElementById('btn09');
if (btn09) {
  btn09.onclick = drawPieChart;
} else {
  console.error("エラー: ボタンbtn09が見つかりません");
}

    // ページをリロードする関数
    function reloadPage() {
    location.reload();
    }

    // ボタンにクリックイベントを追加
    document.getElementById("btn10a").addEventListener("click", reloadPage);
    document.getElementById("btn10b").addEventListener("click", reloadPage);
    document.getElementById("btn10c").addEventListener("click", reloadPage);
    document.getElementById("btn10d").addEventListener("click", reloadPage);
    document.getElementById("btn10e").addEventListener("click", reloadPage);
    document.getElementById("btn10f").addEventListener("click", reloadPage);
    document.getElementById("btn10g").addEventListener("click", reloadPage);
    document.getElementById("btn10h").addEventListener("click", reloadPage);
    document.getElementById("btn10i").addEventListener("click", reloadPage);
    document.getElementById("btn10j").addEventListener("click", reloadPage);
    document.getElementById("btn10k").addEventListener("click", reloadPage);
    document.getElementById("btn10l").addEventListener("click", reloadPage);
    document.getElementById("btn10m").addEventListener("click", reloadPage);  
 
        
  }
  );