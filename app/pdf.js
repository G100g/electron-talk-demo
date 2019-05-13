const HummusRecipe = require("hummus-recipe");
module.exports = function() {
    return {
        combine(pathA, pathB, outputPath) {
            const pdfDoc = new HummusRecipe(pathA, outputPath);
            pdfDoc
                // just page 10
                // .appendPage(longPDF, 10)
                // // page 4 and page 6
                // .appendPage(longPDF, [4, 6])
                // // page 1-3 and 6-20
                // .appendPage(longPDF, [[1, 3], [6, 20]])
                // all pages
                .appendPage(pathB)
                .endPDF();

            // const writer = new hummus

            // const w = createWrite(pathA);
        }
    };
};
