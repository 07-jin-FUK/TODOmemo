
'use strict';

const storage = localStorage;


// エクセルみたいな表
const table = document.querySelector('table');
// TODOエレメント
const todo = document.getElementById('todo');
// 系列ボタン
const priority = document.querySelector('select');
// 登録ボタン
const submit = document.getElementById('submit');

// ストレージ保存の際必要になる。複数保存のためletでなきゃだめっぽい
let list = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. ストレージデータ（JSON）の読み込み
    const json = storage.todolist;
    if (json === undefined) {
        return;
        // ↑データが残ってないときは何もしないコマンド
    }
    // 2. JSONをオブジェクトの配列に変換して配列listに代入
    // ↓ならったやつ
    list = JSON.parse(json);
    for (const item of list) {
        addItem(item);
    }

    // 3. 配列listのデータを元にテーブルに要素を追加
});

// もともと登録の中だったけど繰り返す関数として外に出してそれぞれに適用
// なんでかっていうと、いろんなところで使いたいからッ・・・！
const addItem = (item) => {
    const tr = document.createElement('tr');

    for (const prop in item) {
        const td = document.createElement('td');
        if (prop == 'done') {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item[prop];
            td.appendChild(checkbox);
            // 下は後から追加
            checkbox.addEventListener('change', checkBoxListener);
        } else {
            //    ブラケット記法↓　memo参照※プロパティ名が入るからッ・・・！
            td.textContent = item[prop];
        }   // 行にセルを入れ込み（追加のイメージ） .appendChild()
        tr.appendChild(td);
    }

    // テーブルに行を入れ込み（これも追加？append)
    table.append(tr);

};



// ○○したら△△は↓
submit.addEventListener('click', () => {

    // 入力情報を一つにまとめる
    const item = {};

    if (todo.value != '') {
        item.todo = todo.value;
    } else {
        item.todo = "やることもない暇人め";

    };
    // 下ははじめ書いていたが、上のif構文の邪魔になるので消す
    // item.todo = todo.value;
    // ↓左から表示したい順に書く　チェックボックスをつけたいdoneはさいご！
    item.priority = priority.value;
    item.done = false;
    // console.log(item);
    // ↑任意で消す
    todo.value = "";
    // item.priority = priority.value;
    // ※超重要ここに書いて失敗ッ・・・！チェックボックスの位置ずれる


    // 下の操作を外に出したからaddItemの関数1こで済むッ・・・！
    addItem(item);

    // tr要素を生成(クリエイト初めて) trは行
    // const tr = document.createElement('tr');

    // オブジェクトを繰り返してみる　tdはセルイメージ propはメモ
    // for (const prop in item) {
    //     const td = document.createElement('td');
    //     if (prop == 'done') {
    //         const checkbox = document.createElement('input');
    //         checkbox.type = 'checkbox';
    //         checkbox.checked = item[prop];
    //         td.appendChild(checkbox);
    //     } else {
    //         //    ブラケット記法↓　memo参照※プロパティ名が入るからッ・・・！
    //         td.textContent = item[prop];
    //     }   // 行にセルを入れ込み（追加のイメージ） .appendChild()
    //     tr.appendChild(td);
    // }

    // テーブルに行を入れ込み（これも追加？append)
    // table.append(tr);

    list.push(item);
    storage.todolist = JSON.stringify(list);
});

const filterButton = document.createElement('button'); // ボタン要素を生成
filterButton.textContent = "仕事で絞る";
filterButton.id = 'priority';
const main = document.querySelector('main');
main.appendChild(filterButton);

const filterButton1 = document.createElement('button'); // ボタン要素を生成
filterButton1.textContent = "プライベートで絞る";
filterButton1.id = 'priority1';
main.appendChild(filterButton1);

const filterButton2 = document.createElement('button'); // ボタン要素を生成
filterButton2.textContent = "その他で絞る";
filterButton2.id = 'priority2';
main.appendChild(filterButton2);

const remove = document.createElement('button');
remove.textContent = '完了したTODOを削除する';
remove.id = 'remove';  // CSS装飾用
const br = document.createElement('br'); // 改行したい
main.appendChild(br);
main.appendChild(remove);

const clearTable = () => {
    // Array.from()は（）から配列を作ってくれるっぽい。Arrayの意味は配列
    const trList = Array.from(document.getElementsByTagName('tr'));
    trList.shift();
    for (const tr of trList) {
        tr.remove();
    }
};


filterButton.addEventListener('click', () => {

    clearTable();
    // ↓のを関数を外に出す
    // const trList = Array.from(document.getElementsByTagName('tr'));
    // trList.shift();
    // for (const tr of trList) {
    //     tr.remove();
    // }

    for (const item of list) {
        if (item.priority == '仕事') {
            addItem(item);
        }
    }

});

filterButton1.addEventListener('click', () => {

    clearTable();

    for (const item of list) {
        if (item.priority == 'プライベート') {
            addItem(item);
        }
    }

});

filterButton2.addEventListener('click', () => {

    clearTable();

    for (const item of list) {
        if (item.priority == 'その他') {
            addItem(item);
        }
    }

});


remove.addEventListener('click', () => {
    clearTable();  // TODOデータを一旦削除
    // 配列の内容の置き換えは for-of 文ではできない！！
    // 1. 未完了のTODOを抽出して定数listを置き換え
    list = list.filter((item) => item.done == false);
    // 2. TODOデータをテーブルに追加
    for (const item of list) {
        addItem(item);
    }
    // 3. ストレージデータを更新
    storage.todolist = JSON.stringify(list);
});


const checkBoxListener = (ev) => {
    // 1-1. テーブルの全tr要素のリストを取得（＆配列に変換）
    const trList = Array.from(document.getElementsByTagName('tr'));

    // 1-2. チェックボックスの親（td）の親（tr）を取得
    const currentTr = ev.currentTarget.parentElement.parentElement;
    // ↑ev.currentTargetとしているのはaddItemでcheckboxの定数を使ったので、ここでは使用できないからである！！
    // 1-3. 配列.indexOfメソッドで何番目（インデックス）かを取得
    const idx = trList.indexOf(currentTr) - 1;

    // 2. 配列listにそのインデックスでアクセスしてdoneを更新
    list[idx].done = ev.currentTarget.checked;

    // 3. ストレージデータを更新
    storage.todoList = JSON.stringify(list);
};

// function background() {
//     img = new Array();
//     img[0] = "Img/今田.webp";
//     img[1] = "Img/川口春奈.webp";
//     img[2] = "Img/広瀬アリス.jpg";
//     img[3] = "Img/広瀬すず.jpg";
//     img[4] = "Img/長澤まさみ.jpg";

//     n = Math.floor(Math.random() * img.length);

//     let randomImage = document.getElementsByClassName("random-image");
//     for (let i = 0; i < img.length; i++) {
//         randomImage[i].style.background = "white url(" + img[n] + ") top -20px right -20vw no-repeat fixed";
//     }
// }

// window.addEventListener("load", background, false);

let randomimage = [];
randomimage[0] = "Img/今田.webp";
randomimage[1] = "Img/川口春奈.webp";
randomimage[2] = "Img/広瀬アリス.jpg";
randomimage[3] = "Img/広瀬すず.jpg";
randomimage[4] = "Img/長澤まさみ.jpg";

let n = Math.floor(Math.random() * randomimage.length);
console.log(n);
document.getElementById('random-image').style.background = 'url("' + randomimage[n] + '")  center 250px /contain no-repeat';