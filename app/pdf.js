const HummusRecipe = require("hummus-recipe");

module.exports = function() {
    return {
        combine(pathA, pathB, outputPath) {
            const pdfDoc = new HummusRecipe(pathA, outputPath);
            pdfDoc.appendPage(pathB).endPDF();
        }
    };
};
