"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const ISentence_1 = require("../../../models/ISentence");
//
function get_tranlations(ctx, sentence) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // разделяем переводы где и чьи
            let author_translation = [];
            let common_translation = [];
            // итетируем все переводы предложения
            for (let i = 0; i < sentence.translations.length; i++) {
                // получаем данные перевода
                let translation = yield ISentence_1.Translation.findOne({
                    _id: new mongodb_1.ObjectId(sentence.translations[i])
                });
                // если данные получены
                if (translation) {
                    if (translation.author === ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id)) {
                        // если автор вы, пушим в нужный нам массив
                        author_translation.push(translation);
                    }
                    else {
                        // иначе в общий массив
                        common_translation.push(translation);
                    }
                }
            }
            // Вернем объект для удобства
            return {
                author_translation,
                common_translation
            };
        }
        catch (err) {
            return false;
        }
    });
}
exports.default = get_tranlations;
//# sourceMappingURL=getTranslations.js.map