var words = [];

interface TextGeneratorConfig {
    range?: { min: number, max: number }
    exact?: number
}

class TextGenerator {

    private static PUNC = `!?,.:;/#@-*'"`;
    private static NUMBERS = `٠١٢٣٤٥٦٧٨٩`;

    private static Random(min: number, max: number) {
        return Math.floor(Math.random() * max) + min;
    }

    static Generate(config: TextGeneratorConfig) {
        const numberOfWords = config.exact || TextGenerator.Random(config.range.min, config.range.max);
        let result = '';
        for (let index = 0; index < numberOfWords; index++) {
            let selectedIndex = TextGenerator.Random(0, words.length - 1);
            let word = words[selectedIndex][Current.Language];
            const isLastIndex = index === numberOfWords - 1;

            let punc = '';

            if (Current.TextFormat.hasPunctuation && TextGenerator.Random(0, 50) % 3 == 0) {
                punc = TextGenerator.PUNC[TextGenerator.Random(0, TextGenerator.PUNC.length - 1)];
            }

            result += (result.length == 0 ? '' : ' ');

            if (punc) {
                switch (punc) {
                    case '"':
                        result += punc + word + punc;
                        break;
                    case ',':
                    case '.':
                        result += word + (isLastIndex ? '.' : punc);
                        break;
                    default:
                        if (!isLastIndex) {
                            result += word + " " + punc;
                            index += 1;
                        } else {
                            result += word;
                        }
                }
            } else {
                result += word;
            }


            let number = '';

            if (Current.TextFormat.hasNumbers && TextGenerator.Random(0, 8) % 2 == 0) {
                const numberOfdigits = TextGenerator.Random(1, 4);
                for (let index = 0; index < numberOfdigits; index++) {
                    number += TextGenerator.Random(0, 9);
                }
            }

            if (number !== '' && !isLastIndex) {
                if (Current.Language == Languages.Arabic) {
                    for (let i = 0; i < this.NUMBERS.length; i++) {
                        number = number.replace(new RegExp(i + '', "gm"), this.NUMBERS[i]);
                    }
                }

                result += " " + number;
                index += 1;
            }
        }
        return result;
    }

}