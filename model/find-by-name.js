
class PeflSearcher {
    constructor(_playersBase) {
        this.playersBase = _playersBase;
        this.findByNameResponse = [];
        this.viewPosition = 0;
    }

    getTableRow(rows) {
        const resp = rows.reduce( (tbl,row) => 
            tbl + row.reduce((tr,cel, index) =>
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

                     element = "<i>"+ cel + "</i>  "; 
                    break;
                case 5:
                    element = "<b>"+ global.clubsBase[parseInt(cel)][1] + "</b>  "; 
                    break;
                default:
                    element = cel + "  "; 
                        }
                return tr + element}
            , "")  + "\n"
        , "");
        console.log(resp);
        return resp;
         
    }
    getPlayersPortion(){
        return this.getTableRow(
                this.findByNameResponse.filter(
                    (pl, index) => index >= this.viewPosition && index < (this.viewPosition + 30)
                )
        );
    }
    
    findByName(nameSubString) {
        this.findByNameResponse = this.playersBase.filter(pl => pl[0].toLowerCase().includes(nameSubString.toLowerCase()));
        console.log("findByNameResponse  - ", this.findByNameResponse);
        return this.getTableRow(this.findByNameResponse.length < 31  
                ? this.findByNameResponse
                : this.getPlayersPortion()
        )
        // return this.findByNameResponse.length < 31  
        //     ? this.findByNameResponse
        //     : this.getPlayersPortion()
        
    }
    findByNation(_nation) {
        this.findByNameResponse = this.playersBase.filter(pl => pl[1] == _nation);
        return this.findByNameResponse.length < 31  
                ? this.findByNameResponse
                : this.getPlayersPortion()
    }
    
    getNextPortionOfPlayers() {
        if (this.findByNameResponse.length > this.viewPosition + 30 ) this.viewPosition += 30;
        return this.getPlayersPortion();
    }
    getPrevPortionOfPlayers() {
        if (this.viewPosition >= 30 ) this.viewPosition -= 30;
        return this.getPlayersPortion();
    }
}



module.exports = PeflSearcher;
