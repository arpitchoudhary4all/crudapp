//here all the work is done on itemList means whole list of objects

const itemOperations = {//as there(operations) object should be made once therefore they are made singelton and when multiple objects are needed then we need to make a class
    itemList:[],    //makes an array 
    add(itemObject){    //function
        this.itemList.push(itemObject);
    },
    search(id){
         //return an array of objects whose id gets matched with the id we want to search
        //filter func is func that return true or false
        //0th place because there is only one value which will save value at first place in new array
        return this.itemList.filter(itemObject=>itemObject.id==id)[0];
    },
    countMark(){
        // return this.itemList.filter(itemObject=>itemObject.markForDelete==true).length;  
        return this.itemList.filter(itemObject=>itemObject.markForDelete).length;
    },
    toggleMarking(id){
        this.search(id).toggle();
        // var itemObject=this.searchById(id);
        // itemObject.markForDelete=!itemObject.markForDelete; 
        //itemObject.toggle();
    },
    deleteItem(){
        return this.itemList = this.itemList.filter(itemObject=>!itemObject.markForDelete);
    },
    searchbyid(id){
        return this.itemList = this.itemList.filter(itemObject=>parseInt(itemObject.id)==parseInt(id));
    },
    searchbyname(name){
        return this.itemList = this.itemList.filter(itemObject=>(itemObject.name).includes(name));
    },
    sortbyid(){
        return this.itemList.sort((a,b)=>a.id-b.id);
    },
    sortbyname(){
        return this.itemList.sort((a,b)=>(a.name).localeCompare(b.name));
    }
}