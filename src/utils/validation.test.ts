import { describe, expect, it } from "vitest";
import { isValidInput, sanitizeInput } from "./validation";

describe("isValidInput", () => {
  describe("許可される入力（true）", () => {
    // ===== 文字 =====
    // 半角英字
    it("半角英字（小文字）を許可", () => {
      expect(isValidInput("abcdefghijklmnopqrstuvwxyz")).toBe(true);
    });

    it("半角英字（大文字）を許可", () => {
      expect(isValidInput("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe(true);
    });

    // 半角数字
    it("半角数字を許可", () => {
      expect(isValidInput("0123456789")).toBe(true);
    });

    // 全角英字
    it("全角英字（小文字）を許可", () => {
      expect(
        isValidInput("ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"),
      ).toBe(true);
    });

    it("全角英字（大文字）を許可", () => {
      expect(
        isValidInput("ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"),
      ).toBe(true);
    });

    // 全角数字
    it("全角数字を許可", () => {
      expect(isValidInput("０１２３４５６７８９")).toBe(true);
    });

    // ひらがな
    it("ひらがなを許可", () => {
      expect(isValidInput("あいうえおかきくけこさしすせそ")).toBe(true);
    });

    it("ひらがな（小文字）を許可", () => {
      expect(isValidInput("ぁぃぅぇぉっゃゅょゎ")).toBe(true);
    });

    it("ひらがな（濁音・半濁音）を許可", () => {
      expect(
        isValidInput("がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ"),
      ).toBe(true);
    });

    // カタカナ（全角）
    it("全角カタカナを許可", () => {
      expect(isValidInput("アイウエオカキクケコサシスセソ")).toBe(true);
    });

    it("全角カタカナ（小文字）を許可", () => {
      expect(isValidInput("ァィゥェォッャュョヮ")).toBe(true);
    });

    it("全角カタカナ（濁音・半濁音）を許可", () => {
      expect(
        isValidInput("ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ"),
      ).toBe(true);
    });

    it("全角カタカナ（特殊）を許可", () => {
      expect(isValidInput("ヴヵヶ")).toBe(true);
    });

    // カタカナ（半角）
    it("半角カタカナを許可", () => {
      expect(isValidInput("ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ")).toBe(true);
    });

    it("半角カタカナ（濁点・半濁点）を許可", () => {
      expect(isValidInput("ｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ")).toBe(true);
    });

    // 漢字
    it("常用漢字を許可", () => {
      expect(isValidInput("日本語漢字入力制限")).toBe(true);
    });

    it("人名漢字を許可", () => {
      expect(isValidInput("田中太郎山田花子")).toBe(true);
    });

    it("数字を含む漢字を許可", () => {
      expect(isValidInput("一二三四五六七八九十百千万億")).toBe(true);
    });

    // ===== 許可記号 =====
    it("長音記号を許可", () => {
      expect(isValidInput("ラーメン")).toBe(true);
    });

    it("半角ハイフンを許可", () => {
      expect(isValidInput("test-case")).toBe(true);
    });

    it("半角カンマを許可", () => {
      expect(isValidInput("a,b,c")).toBe(true);
    });

    it("半角ピリオドを許可", () => {
      expect(isValidInput("test.txt")).toBe(true);
    });

    it("句点を許可", () => {
      expect(isValidInput("終わり。")).toBe(true);
    });

    it("読点を許可", () => {
      expect(isValidInput("りんご、みかん")).toBe(true);
    });

    it("中黒を許可", () => {
      expect(isValidInput("純米・大吟醸")).toBe(true);
    });

    it("全角ハイフンを許可", () => {
      expect(isValidInput("大吟醸－生酒")).toBe(true);
    });

    it("波ダッシュを許可", () => {
      expect(isValidInput("秋～冬限定")).toBe(true);
    });

    it("全角括弧を許可", () => {
      expect(isValidInput("純米酒（山田錦）")).toBe(true);
    });

    it("鉤括弧を許可", () => {
      expect(isValidInput("「幻の銘酒」")).toBe(true);
    });

    it("半角パーセントを許可", () => {
      expect(isValidInput("精米歩合50%")).toBe(true);
    });

    it("全角パーセントを許可", () => {
      expect(isValidInput("精米歩合５０％")).toBe(true);
    });

    // ===== 酒名の実例 =====
    it("酒名例: 獺祭・純米大吟醸", () => {
      expect(isValidInput("獺祭・純米大吟醸")).toBe(true);
    });

    it("酒名例: 久保田（千寿）", () => {
      expect(isValidInput("久保田（千寿）")).toBe(true);
    });

    it("酒名例: 「十四代」本丸", () => {
      expect(isValidInput("「十四代」本丸")).toBe(true);
    });

    it("酒名例: 精米歩合50%", () => {
      expect(isValidInput("精米歩合50%")).toBe(true);
    });

    it("酒名例: 秋～冬季限定", () => {
      expect(isValidInput("秋～冬季限定")).toBe(true);
    });

    // ===== 複合パターン =====
    it("ひらがな・カタカナ・漢字の混在を許可", () => {
      expect(isValidInput("お酒ハックSakeHack日本酒")).toBe(true);
    });

    it("英数字と日本語の混在を許可", () => {
      expect(isValidInput("ABC123あいうアイウ漢字")).toBe(true);
    });

    // ===== エッジケース =====
    it("空文字を許可", () => {
      expect(isValidInput("")).toBe(true);
    });
  });

  describe("禁止される入力（false）", () => {
    // スペース
    it("半角スペースを禁止", () => {
      expect(isValidInput("hello world")).toBe(false);
    });

    it("全角スペースを禁止", () => {
      expect(isValidInput("こんにちは　世界")).toBe(false);
    });

    // 記号（ASCII）
    it("感嘆符を禁止", () => {
      expect(isValidInput("Hello!")).toBe(false);
    });

    it("クエスチョンマークを禁止", () => {
      expect(isValidInput("何?")).toBe(false);
    });

    it("アットマークを禁止", () => {
      expect(isValidInput("test@example")).toBe(false);
    });

    it("シャープを禁止", () => {
      expect(isValidInput("#hashtag")).toBe(false);
    });

    it("ドルマークを禁止", () => {
      expect(isValidInput("$100")).toBe(false);
    });

    it("アンパサンドを禁止", () => {
      expect(isValidInput("A&B")).toBe(false);
    });

    it("アスタリスクを禁止", () => {
      expect(isValidInput("*important*")).toBe(false);
    });

    it("スラッシュを禁止", () => {
      expect(isValidInput("and/or")).toBe(false);
    });

    it("バックスラッシュを禁止", () => {
      expect(isValidInput("path\\to")).toBe(false);
    });

    it("山括弧を禁止", () => {
      expect(isValidInput("<script>")).toBe(false);
    });

    it("半角括弧を禁止", () => {
      expect(isValidInput("(test)")).toBe(false);
    });

    it("角括弧を禁止", () => {
      expect(isValidInput("[array]")).toBe(false);
    });

    it("波括弧を禁止", () => {
      expect(isValidInput("{object}")).toBe(false);
    });

    it("コロンを禁止", () => {
      expect(isValidInput("key:value")).toBe(false);
    });

    it("セミコロンを禁止", () => {
      expect(isValidInput("a;b")).toBe(false);
    });

    it("クォートを禁止", () => {
      expect(isValidInput("'quoted'")).toBe(false);
    });

    it("ダブルクォートを禁止", () => {
      expect(isValidInput('"quoted"')).toBe(false);
    });

    it("アンダースコアを禁止", () => {
      expect(isValidInput("test_case")).toBe(false);
    });

    it("プラスを禁止", () => {
      expect(isValidInput("1+1")).toBe(false);
    });

    it("イコールを禁止", () => {
      expect(isValidInput("a=b")).toBe(false);
    });

    it("チルダを禁止", () => {
      expect(isValidInput("~home")).toBe(false);
    });

    it("バッククォートを禁止", () => {
      expect(isValidInput("`code`")).toBe(false);
    });

    it("パイプを禁止", () => {
      expect(isValidInput("a|b")).toBe(false);
    });

    it("キャレットを禁止", () => {
      expect(isValidInput("2^3")).toBe(false);
    });

    // 日本語記号（禁止のもの）
    it("全角感嘆符を禁止", () => {
      expect(isValidInput("すごい！")).toBe(false);
    });

    it("全角クエスチョンを禁止", () => {
      expect(isValidInput("何？")).toBe(false);
    });

    it("円マークを禁止", () => {
      expect(isValidInput("¥1000")).toBe(false);
    });

    it("隅付き括弧を禁止", () => {
      expect(isValidInput("【重要】")).toBe(false);
    });

    it("全角コロンを禁止", () => {
      expect(isValidInput("項目：値")).toBe(false);
    });

    // 特殊文字
    it("タブを禁止", () => {
      expect(isValidInput("a\tb")).toBe(false);
    });

    it("改行を禁止", () => {
      expect(isValidInput("line1\nline2")).toBe(false);
    });

    it("絵文字を禁止", () => {
      expect(isValidInput("楽しい😊")).toBe(false);
    });

    it("ギリシャ文字を禁止", () => {
      expect(isValidInput("αβγ")).toBe(false);
    });

    it("ロシア文字を禁止", () => {
      expect(isValidInput("абв")).toBe(false);
    });

    // セキュリティ関連
    it("HTMLタグを禁止", () => {
      expect(isValidInput("<script>alert('xss')</script>")).toBe(false);
    });

    it("SQLインジェクション風入力を禁止", () => {
      expect(isValidInput("'; DROP TABLE users;--")).toBe(false);
    });
  });
});

describe("sanitizeInput", () => {
  describe("禁止文字の除去", () => {
    it("半角スペースを除去", () => {
      expect(sanitizeInput("hello world")).toBe("helloworld");
    });

    it("全角スペースを除去", () => {
      expect(sanitizeInput("こんにちは　世界")).toBe("こんにちは世界");
    });

    it("複数の記号を除去", () => {
      expect(sanitizeInput("test!@#$")).toBe("test");
    });

    it("日本語記号を除去", () => {
      expect(sanitizeInput("こんにちは！？")).toBe("こんにちは");
    });

    it("HTMLタグを除去", () => {
      expect(sanitizeInput("<script>alert</script>")).toBe("scriptalertscript");
    });

    it("絵文字を除去", () => {
      expect(sanitizeInput("楽しい😊")).toBe("楽しい");
    });
  });

  describe("許可文字・記号の保持", () => {
    it("半角英数字を保持", () => {
      expect(sanitizeInput("abc123!@#")).toBe("abc123");
    });

    it("全角英数字を保持", () => {
      expect(sanitizeInput("ＡＢＣ１２３！")).toBe("ＡＢＣ１２３");
    });

    it("ひらがなを保持", () => {
      expect(sanitizeInput("あいう！えお")).toBe("あいうえお");
    });

    it("カタカナを保持", () => {
      expect(sanitizeInput("アイウ！エオ")).toBe("アイウエオ");
    });

    it("漢字を保持", () => {
      expect(sanitizeInput("日本語！入力")).toBe("日本語入力");
    });

    it("半角カタカナを保持", () => {
      expect(sanitizeInput("ｱｲｳ!ｴｵ")).toBe("ｱｲｳｴｵ");
    });

    it("長音記号を保持", () => {
      expect(sanitizeInput("ラーメン！")).toBe("ラーメン");
    });

    it("句読点を保持", () => {
      expect(sanitizeInput("りんご、みかん。！")).toBe("りんご、みかん。");
    });

    it("中黒を保持", () => {
      expect(sanitizeInput("純米・大吟醸！")).toBe("純米・大吟醸");
    });

    it("パーセントを保持", () => {
      expect(sanitizeInput("50%！")).toBe("50%");
    });
  });

  describe("エッジケース", () => {
    it("空文字はそのまま", () => {
      expect(sanitizeInput("")).toBe("");
    });

    it("許可文字のみの場合はそのまま", () => {
      expect(sanitizeInput("ABCあいう漢字")).toBe("ABCあいう漢字");
    });

    it("禁止文字のみの場合は空文字", () => {
      expect(sanitizeInput("!@#$^&*()")).toBe("");
    });
  });
});
