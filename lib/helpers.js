"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixin = void 0;
/**
 * https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * @param derivedCtor
 * @param constructors
 */
function mixin(derivedCtor, constructors) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null));
        });
    });
}
exports.mixin = mixin;
