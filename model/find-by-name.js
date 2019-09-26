const pefl_host = 'plug.php';
const pefl = 'http://pefl.ru/';

class PeflSearcher {
    constructor(_playersBase) {
        this.playersBase = _playersBase;
        this.findByNameResponse = [];
        this.viewPosition = 0;
        this.portion = 10;
    }
    getClubUrl(_j, _z) {
        const clubURL = new URL(pefl + pefl_host); 
        clubURL.search = new URLSearchParams([
            ['p', 'refl'],
            ['t', 'k'],
            ['j', _j],
            ['z', _z],
            ]);;
        return clubURL.toString();    
    }

    getTableRow(rows) {

            console.log("rows - ", rows);

        if (!Array.isArray(rows) || (rows.length == 0)) {
            return "<b> - </b>  "; 
        }
        const resp = rows.reduce( (tbl,row, _index) => 
            tbl + (this.viewPosition + _index + 1) + '. '
                + row.reduce((tr,cel, index) =>
                    { let element = "";
                    switch(index) {
                        case 0:  
                        case 2:  
                        case 3:
                            element = "<b>"+ cel + "</b>  "; 
                            break;
                        case 1:                
                        case 6:
                            element = "<i>"+ global.nationBase[parseInt(cel)][1] + "</i>  "; 
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
                        default:
                            element = cel + "  "; 
                        }
                        return tr + element}
            , "")  + "\n"
        , "");
        // console.log(resp);
        return resp;
         
    }
    getPlayersPortion(){
        const respPortion = this.findByNameResponse.filter(
            (pl, index) => index >= this.viewPosition && index < (this.viewPosition + this.portion)
        );
            console.log("i= ", this.viewPosition, " -- ",  respPortion);
        return respPortion;
        // return this.getTableRow(respPortion);
    }
    
    findByName(nameSubString) {
        this.viewPosition = 0;
        this.findByNameResponse = this.playersBase.filter(pl => pl[0].toLowerCase().includes(nameSubString.toLowerCase()));
        console.log("findByNameResponse  - ", this.findByNameResponse);
        return this.getTableRow(this.findByNameResponse.length < (this.portion + 1)  
                ? this.findByNameResponse
                : this.getPlayersPortion()
        )        
    }
    findByNation(_nation) {
        this.viewPosition = 0;
        this.findByNameResponse = this.playersBase.filter(pl => pl[1] == _nation);
        return this.getTableRow( this.findByNameResponse.length < (this.portion + 1)  
                ? this.findByNameResponse
                : this.getPlayersPortion()
        )
    }
    
    getNextPortionOfPlayers() {
        if (this.findByNameResponse.length > this.viewPosition + this.portion ) this.viewPosition += this.portion;
        return this.getTableRow(this.getPlayersPortion());
    }
    getPrevPortionOfPlayers() {
        if (this.viewPosition >= this.portion ) this.viewPosition -= this.portion;
        return this.getTableRow(this.getPlayersPortion());
    }
}



module.exports = PeflSearcher;
