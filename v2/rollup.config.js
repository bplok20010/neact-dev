import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/Neact.js',
    format: 'umd',
    moduleName: "Neact",
    plugins: [json(), babel({
        "plugins": [
            "transform-es3-property-literals",
            "transform-es3-member-expression-literals",
            //	['transform-es2015-modules-commonjs', { "loose": true }],
            'transform-es2015-arrow-functions',
            'transform-es2015-block-scoped-functions',
            'transform-es2015-block-scoping',
            'transform-es2015-classes',
            'transform-es2015-computed-properties',
            'transform-es2015-destructuring',
            'transform-es2015-for-of',
            'transform-es2015-function-name',
            'transform-es2015-literals',
            'transform-es2015-object-super',
            'transform-es2015-parameters',
            'transform-es2015-spread',
            'transform-es2015-sticky-regex',
            'transform-es2015-template-literals',
            'transform-es2015-typeof-symbol',
            'transform-es2015-unicode-regex',
        ]
    })],
    dest: 'dist/bundle.js'
};