import type { QuestionFilter, SelectedFilters } from "../util/types";
import crc32 from "crc-32";


export function buildVerificationData(questions: QuestionFilter[], filters: SelectedFilters) {
    const simplifiedQuestions = questions.map(question => ({
        key: question.key,
        values: question.values.map(value => ({
            value: value.key
        }))
    }))

    const simplifiedFilters = filters.map(filter => ({
        key: filter.key,
        values: filter.values
    }))

    const questionsJSON = JSON.stringify(simplifiedQuestions)
    const filtersJSON = JSON.stringify(simplifiedFilters)

    const questionsHASH = crc32.str(questionsJSON)
    const filtersHASH = crc32.str(filtersJSON)
    const length = questionsJSON.length

    return [length, Int32Array.from([questionsHASH])[0], Int32Array.from([filtersHASH])[0]]
}

export function selectedFiltersToIndexesArray(selectedFilters: SelectedFilters, questions: QuestionFilter[]) {
    const selectedFiltersAsMap = new Map<string, string[]>()
    selectedFilters.forEach(selectedFilter => {
        selectedFiltersAsMap.set(selectedFilter.key, selectedFilter.values)
    })

    let compactedDataArray: ([number, number])[] = []

    for (let i = 0; i < questions.length; i++) {
        const values = selectedFiltersAsMap.get(questions[i].key)
        if (!values) continue

        for (let j = 0; j < values.length; j++) {
            compactedDataArray.push([i, questions[i].values.findIndex(value => value.key == values[j])])
        }
    }

    return indexesArrayToInt32Array(compactedDataArray)
}

export function indexesArrayToSelectedFilters(indexesArray: ([number, number])[], questions: QuestionFilter[]) {
    const selectedFiltersAsMap = new Map<string, string[]>()

    for (let i = 0; i < indexesArray.length; i++) {
        const questionIndex = indexesArray[i][0]
        const valueIndex = indexesArray[i][1]

        const question = questions[questionIndex]
        const value = question.values[valueIndex]

        if (!selectedFiltersAsMap.has(question.key)) {

            selectedFiltersAsMap.set(question.key, [value.key])
        } else {
            const values = selectedFiltersAsMap.get(question.key)!
            values.push(value.key)
            selectedFiltersAsMap.set(question.key, values)
        }
    }

    const selectedFilters: SelectedFilters = []

    let i = 0
    selectedFiltersAsMap.forEach((values, key) => {
        selectedFilters.push({
            questionIndex: i++,
            key,
            values
        })
    })

    return selectedFilters
}

export function indexesArrayToInt32Array(indexesArray: ([number, number])[]) {
    const int32Array = new Int32Array(indexesArray.length)

    for (let i = 0; i < indexesArray.length; i++) {
        const questionIndex = indexesArray[i][0]
        const valueIndex = indexesArray[i][1]

        const combined = questionIndex | (valueIndex << 16)

        int32Array[i] = combined
    }

    return int32Array
}

export function int32ArrayToIndexesArray(int32Array: Int32Array) {
    const indexesArray: ([number, number])[] = []

    for (let i = 0; i < int32Array.length; i++) {
        const combined = int32Array[i]

        const questionIndex = combined >> 16
        const valueIndex = combined - (questionIndex << 16)

        indexesArray.push([questionIndex, valueIndex])

    }

    return indexesArray
}

export function buildDataArray(verificationData: ReturnType<typeof buildVerificationData>, indexesArray: Int32Array): Int8Array {
    return int32ArrayToUint8Array(Int32Array.from([...verificationData, ...indexesArray]))
}

export function deconstructDataArray(dataArray: Int8Array) {
    const int32Array = uint8ArrayToInt32Array(dataArray)

    const verificationData: ReturnType<typeof buildVerificationData> = [int32Array[0], int32Array[1], int32Array[2]]
    const indexesArray = int32Array.slice(3)

    return [verificationData, indexesArray] as const
}


function int32ArrayToUint8Array(int32Array: Int32Array) {
    const uint8Array = new Int8Array(int32Array.length * 4)

    for (let i = 0; i < int32Array.length; i++) {
        const int32 = int32Array[i]

        uint8Array[i * 4] = int32 & 0xFF
        uint8Array[i * 4 + 1] = (int32 >> 8) & 0xFF
        uint8Array[i * 4 + 2] = (int32 >> 16) & 0xFF
        uint8Array[i * 4 + 3] = (int32 >> 24) & 0xFF
    }

    return uint8Array
}

function uint8ArrayToInt32Array(uint8Array: Int8Array): Int32Array {
    const int32Array = new Int32Array(uint8Array.length / 4)

    for (let i = 0; i < int32Array.length; i++) {
        const int32 = uint8Array[i * 4] | (uint8Array[i * 4 + 1] << 8) | (uint8Array[i * 4 + 2] << 16) | (uint8Array[i * 4 + 3] << 24)

        int32Array[i] = int32
    }

    return int32Array
}

export function selectedFiltersToFragment(selectedFilters: SelectedFilters, questions: QuestionFilter[]) {
    const verificationData = buildVerificationData(questions, selectedFilters)
    const indexesArray = selectedFiltersToIndexesArray(selectedFilters, questions)
    const dataArray = buildDataArray(verificationData, indexesArray)

    return btoa(String.fromCharCode(...new Uint8Array(dataArray)));
}

export function fragmentToSelectedFilters(fragment: string, questions: QuestionFilter[]) {
    if(fragment[0] == "#") fragment = fragment.slice(1, fragment.length)

    if(!fragment) return []

    const decodedStr = atob(fragment);

    // Convert the decoded string to an Int8Array
    const dataArray = new Int8Array(decodedStr.length);
    for (let i = 0; i < decodedStr.length; i++) {
        dataArray[i] = decodedStr.charCodeAt(i);
    }

    const [[length, questionsHash, selectedFiltersHash], indexesArray] = deconstructDataArray(dataArray)

    const selectedFilters = indexesArrayToSelectedFilters(int32ArrayToIndexesArray(indexesArray), questions)

    const [realLength, realQuestionsHash, realSelectedFiltersHash] = buildVerificationData(questions, selectedFilters)

    console.log(length, questionsHash, selectedFiltersHash)
    console.log(realLength, realQuestionsHash, realSelectedFiltersHash)

    // if(length != realLength) return []
    // if(questionsHash != realQuestionsHash) return []
    // if(selectedFiltersHash != realSelectedFiltersHash) return []

    return selectedFilters
}

