function getChatId(A, B){
    lst = [A,B].sort()
    return String(lst[0]) + String(lst[1])
}

module.exports = {
    getChatId,
}