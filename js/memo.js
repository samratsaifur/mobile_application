"use strict";

// SweetAlert Sound Settings
function playSound(type) {
  const soundFiles = {
    error: "sound/error.mp3.wav",
    question: "sound/confirm.mp3.wav",
    success: "sound/success.mp3.wav",
  };

  const file = soundFiles[type];
  if (!file) return;

  const audio = new Audio(file);

  audio.play().catch((error) => {
    console.warn("Sound playback error:", error);
  });
}

// SweetAlert + Sound Function
function showAlert(options) {
  playSound(options.icon || options.type);
  return Swal.fire(options);
}

// DOMContentLoaded
document.addEventListener(
  "DOMContentLoaded",
  function () {
    if (typeof localStorage === "undefined") {
      window.alert("このブラウザはLocal Storage機能が実装されていません");
      return;
    } else {
      viewStorage();
      saveLocalStorage();
      selectTable();
      delLocalStorage();
      allClearLocalStorage();
    }
  },
  false,
);

// 1. localStorageから選択されたデータを削除
function delLocalStorage() {
  const del = document.getElementById("del");

  del.addEventListener(
    "click",
    function (e) {
      e.preventDefault();

      const chkbox1 = document.getElementsByName("chkbox1");
      const table1 = document.getElementById("table1");

      let w_cnt = selectCheckBox("del");

      if (w_cnt >= 1) {
        let w_msg =
          "LocalStorageから選択されている" +
          w_cnt +
          "件を削除（delete）しますか？";

        showAlert({
          title: "Memo app",
          html: w_msg,
          icon: "question",
          type: "question",
          showCancelButton: true,
        }).then(function (result) {
          if (result.value || result.isConfirmed) {
            for (let i = 0; i < chkbox1.length; i++) {
              if (chkbox1[i].checked) {
                localStorage.removeItem(
                  table1.rows[i + 1].cells[1].firstChild.data,
                );
              }
            }

            viewStorage();

            let w_msg =
              "LocalStorageから" + w_cnt + "件を削除（delete）しました。";

            showAlert({
              title: "Memo app",
              html: w_msg,
              icon: "success",
              type: "success",
              allowOutsideClick: false,
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
      }
    },
    false,
  );

  // version-up5 add-str

  // Event Delegation
  const table1 = document.getElementById("table1");

  table1.addEventListener(
    "click",
    (e) => {
      if (e.target.closest(".trash")) {
        const row = e.target.closest("tr");

        const key = row.cells[1].textContent.trim();
        const value = row.cells[2].textContent.trim();

        let w_delete = `LocalStorageから\n[${key} ${value}]\nを削除しますか？`;

        showAlert({
          title: "Memo app",
          html: w_delete,
          icon: "question",
          type: "question",
          showCancelButton: true,
        }).then((result) => {
          if (result.value || result.isConfirmed) {
            localStorage.removeItem(key);

            viewStorage();

            let w_msg = `LocalStorageから${key} ${value}を削除(delete)しました！`;

            showAlert({
              title: "Memo app",
              html: w_msg,
              icon: "success",
              type: "success",
              allowOutsideClick: false,
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
      }
    },
    false,
  );

  // version-up5 add-end
}

// 2. localStorageにデータを保存
function saveLocalStorage() {
  const save = document.getElementById("save");

  save.addEventListener(
    "click",
    function (e) {
      e.preventDefault();

      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;

      if (key == "" || value == "") {
        showAlert({
          title: "Memo app",
          html: "Key、Memoはいずれも必須です。",
          icon: "error",
          type: "error",
          allowOutsideClick: false,
        });
        return;
      } else {
        let w_msg =
          "LocalStorageに\n「" +
          key +
          " " +
          value +
          "」\nを保存（save）しますか？";

        showAlert({
          title: "Memo app",
          html: w_msg,
          icon: "question",
          type: "question",
          showCancelButton: true,
          allowOutsideClick: false,
        }).then(function (result) {
          if (result.value || result.isConfirmed) {
            localStorage.setItem(key, value);
            viewStorage();

            let w_msg =
              "LocalStorageに" +
              key +
              " " +
              value +
              "を保存（ほぞん）しました。";

            showAlert({
              title: "Memo app",
              html: w_msg,
              icon: "success",
              type: "success",
              allowOutsideClick: false,
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
      }
    },
    false,
  );
}

// 3. 選択処理
function selectTable() {
  const select = document.getElementById("select");

  select.addEventListener(
    "click",
    function (e) {
      e.preventDefault();

      selectCheckBox("select");
    },
    false,
  );
}

// 4. テーブルからデータ選択
function selectCheckBox(mode) {
  let w_cnt = 0;

  const chkbox1 = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");

  let w_textKey = "";
  let w_textMemo = "";

  for (let i = 0; i < chkbox1.length; i++) {
    if (chkbox1[i].checked) {
      if (w_cnt === 0) {
        w_textKey = table1.rows[i + 1].cells[1].firstChild.data;
        w_textMemo = table1.rows[i + 1].cells[2].firstChild.data;
      }

      w_cnt++;
    }
  }

  document.getElementById("textKey").value = w_textKey;
  document.getElementById("textMemo").value = w_textMemo;

  if (mode === "select") {
    if (w_cnt === 1) {
      return w_cnt;
    } else {
      showAlert({
        title: "Memo app",
        html: "1つ選択（select）してください。",
        icon: "error",
        type: "error",
        allowOutsideClick: false,
      });
    }
  } else if (mode === "del") {
    if (w_cnt >= 1) {
      return w_cnt;
    } else {
      showAlert({
        title: "Memo app",
        html: "1つ以上選択（select）してください。",
        icon: "error",
        type: "error",
        allowOutsideClick: false,
      });
    }
  }
}

// 5. localStorageからデータを取得してテーブルに表示
function viewStorage() {
  const list = document.getElementById("list");

  while (list.rows[0]) {
    list.deleteRow(0);
  }

  for (let i = 0; i < localStorage.length; i++) {
    let w_key = localStorage.key(i);

    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");

    list.appendChild(tr);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    td1.innerHTML = '<input name="chkbox1" type="checkbox">';

    td2.textContent = w_key;
    td3.textContent = localStorage.getItem(w_key);

    td4.innerHTML = '<img src="img/trash_icon.png" class="trash">';
  }

  $("#table1").tablesorter({
    sortList: [[1, 0]],
  });

  $("#table1").trigger("update");
}

// 6. localStorageからすべて削除
function allClearLocalStorage() {
  const allClear = document.getElementById("allClear");

  allClear.addEventListener(
    "click",
    function (e) {
      e.preventDefault();

      let w_msg =
        "LocalStorageのデータをすべて削除（all clear）します。\nよろしいですか？";

      showAlert({
        title: "Memo app",
        html: w_msg,
        icon: "question",
        type: "question",
        showCancelButton: true,
      }).then(function (result) {
        if (result.value || result.isConfirmed) {
          localStorage.clear();

          viewStorage();

          let w_msg = "LocalStorageのデータをすべて削除（all clear）しました。";

          showAlert({
            title: "Memo app",
            html: w_msg,
            icon: "success",
            type: "success",
            allowOutsideClick: false,
          });

          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";
        }
      });
    },
    false,
  );
}
