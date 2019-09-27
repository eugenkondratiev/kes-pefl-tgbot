const pefl_host = 'plug.php';
const pefl = 'http://pefl.ru/';

function  getTableRow(rows) {

            console.log("rows - ", rows);

        if (!Array.isArray(rows) || (rows.length == 0)) {
            return "<b> - </b>  "; 
        }
        const resp = `Найдено ${this.searchResponse.length} совпадений\n`
            + rows.reduce( (tbl,row, _index) => 
                tbl + (this.viewPosition + _index + 1) + '. '
                 + row.reduce((tr,cel, index) =>
                    { let element = "";
                    switch(index) {
                        case 0:  
                        case 2:  
                            element = "<b>"+ cel + "</b>  "; 
                            break;
                        case 3:
                            element = cel == 'GK' ? "<b>"+ cel + "</b>  " : (cel + " "); 
                            break;
                        case 1:                
                        case 6:
                            element = cel == '-1' 
                            ? "<i>-CA-</i>  "
                            : "<i>"+ global.nationBase[parseInt(cel)][1] + "</i>  "; 
                            break;
                        case 4:             
                            
                            element = "<i>" + (cel == 0 ? "-" : cel == 2 ? "шк" : "пенс")  + "</i>  "; 
                            break;
                        case 5:
                            element = cel == '' 
                                    ? '- ' 
                                    : ('<a href="'+ this.getClubUrl(global.clubsBase[parseInt(cel)][0], global.clubsBase[parseInt(cel)][2]) 
                                + '">' + global.clubsBase[parseInt(cel)][1] + '</a>  '); 
                            break;
                        case 7:
                                element = cel == '' 
                                        ? '' 
                                        : ('<a href="'+ pefl + cel 
                                    + '">ссылка</a>  '); 
                                break;
                        default:
                            element = cel + "  "; 
                        }
                        return tr + element}
            , "")  + "\n"
        , "");
        // console.log(resp);
        return resp;
         
    }
 
    
function findId(_nation) {
        // this.viewPosition = 0;
        const nations = global.nationBase
        .filter(n => n[1].toLowerCase().includes(_nation))
        const nationsResponse = nations.length == 0 
            ? "-" 
            : nations.reduce((resp , n, index) => {
                return resp + " " + (index + 1) + ". " + n[1] + " <b>" + n[0] + "</b>\n"
            }, " ")

        return nationsResponse;
    }


module.exports = findId;
