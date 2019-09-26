function getTableRow(row) {
    return row.reduce((tr,cel) => tr + "<td>"+ cel + "</td>", "<tr>")  + "</tr>"
}

module.exports = {
    getTableRow: getTableRow
};