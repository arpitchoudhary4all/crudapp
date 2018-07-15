window.addEventListener("load",()=>{
    document.querySelector("#output").innerHTML=0;
    document.querySelector("#price").value=0;
    document.querySelector("#price").addEventListener("change",updatePrice);
    document.querySelector("#addBt").addEventListener("click",addItem);
    document.querySelector("#deleteBt").addEventListener("click",deleteItem);
    document.querySelector("#searchidBt").addEventListener("click",searchByID);
    document.querySelector("#searchnameBt").addEventListener("click",searchByName);
    document.querySelector("#updateBt").addEventListener("click",updateItem);
    document.querySelector("#sortidBt").addEventListener("click",sortByID);
    document.querySelector("#sortnameBt").addEventListener("click",sortByName);
    document.querySelector("#saveBt").addEventListener("click",saveItem);
    document.querySelector("#loadBt").addEventListener("click",loadItem);
    document.querySelector("#loadfromserverBt").addEventListener("click",loadfromserver);
    document.querySelector("#clearBt").addEventListener("click",clearall);
    });
    
    const updatePrice=()=>{
        document.querySelector("#output").innerHTML = `<b>${document.querySelector("#price").value}</b>`;
    }

    const updateCount = ()=>{
        document.querySelector("#total").innerHTML = itemOperations.itemList.length;
        document.querySelector("#markrecord").innerHTML = itemOperations.countMark();
        document.querySelector("#unmark").innerHTML =itemOperations.itemList.length- itemOperations.countMark();
    }

    function createIcon(id, path,fn){
        var img = document.createElement("img");
        img.src = path;
        img.className = "icon";//dynamically assign class to attribute
        img.setAttribute("item-id", id);
        // img.id = id;
        img.addEventListener("click",fn);
        return img;
    }
    
    function toggleMarkUnMark(event){
        var img = event.srcElement;//retrive source element of the event(here img tag)
        console.log("get the source element ",img);
        var id = img.getAttribute("item-id");
        console.log("Delete is Called....",id);
        //console.log("this is ",this);
        console.log("Parent is ",this.parentNode.parentNode);
        var tr = img.parentNode.parentNode;
        tr.classList.toggle("red");
        itemOperations.toggleMarking(id);
        updateCount();
    }
    
    var obj;
    function edit(){        
        var img = event.srcElement;
        var id = img.getAttribute("item-id");
        obj=itemOperations.search(id);
        document.querySelector("#itemid").value=obj.id;
        document.querySelector("#itemid").disabled=true;
        document.querySelector("#name").value=obj.name;
        document.querySelector("#desc").value=obj.desc;
        document.querySelector("#price").value=obj.price;
        document.querySelector("#url").value=obj.url;
        document.querySelector("#color").value=obj.color;
        document.querySelector("#date").value=obj.date;
        updatePrice();
    }

    function addItem(){
        var id = document.querySelector("#itemid").value;
        var name = document.querySelector("#name").value;
        var desc = document.querySelector("#desc").value;
        var price = document.querySelector("#price").value;
        var url = document.querySelector("#url").value;
        var color = document.querySelector("#color").value;
        var date = document.querySelector("#date").value;
        
        var itemObject = new Item(id, name,desc,price,color,url,date);//creates new object of Item
        itemOperations.add(itemObject);//calls add function of singleton objectr of class itemOperations
        printItem(itemObject);//object passed as an argument
        updateCount();
    }
    
    function printItemTable(){
        var tbody =document.querySelector("#itemtable");
        tbody.innerHTML="";
        itemOperations.itemList.forEach(printItem);
    }

    function printItem(itemObject){
        var itemTable = document.querySelector("#itemtable");//table retrived
        var tr = itemTable.insertRow();//new row added dynamically
       // tr.insertCell(0).innerHTML = itemObject.id;
       // tr.insertCell(1).innerHTML = itemObject.name;
       let index = 0;
       for(let key in itemObject){//traverses object to print values in table using for-in loop
        if(key=="markForDelete"){
            continue;
        }   
        if(key=="url"){
            tr.insertCell(index).innerHTML =`<img class='url' src='${itemObject[key]}'/>`;
            index++;
            continue;    
        }
        if(key=="color"){
            tr.insertCell(index).innerHTML =`<div style='border-radius:50%;width: 20px;height:20px;background-color:${itemObject[key]}'></div>`;
            index++;
            continue;
        }
        tr.insertCell(index).innerHTML = itemObject[key];
           index++;
       }
      var operationTd =  tr.insertCell(index);//insert new cell to row
      var id = itemObject.id;//retrives id of the current object passed
      operationTd.appendChild(createIcon(id,"images/delete.png",toggleMarkUnMark));
      operationTd.appendChild(createIcon(id,"images/edit.png",edit));
    }

    function deleteItem(){
        itemOperations.deleteItem();
        printItemTable();
        updateCount();
    }
    
    function searchByID(){
        var id = document.querySelector("#itemid").value;
        itemOperations.searchbyid(id);
        printItemTable();
        updateCount();
    }

    function searchByName(){
        var name = document.querySelector("#name").value;
        itemOperations.searchbyname(name);
        printItemTable();
        updateCount();
    }
    
    function updateItem(){
        var id = document.querySelector("#itemid").value;
        obj. name = document.querySelector("#name").value;
        obj.desc = document.querySelector("#desc").value;
        obj.price = document.querySelector("#price").value;
        obj.url = document.querySelector("#url").value;
        obj.color = document.querySelector("#color").value;
        obj.date = document.querySelector("#date").value;
        printItemTable();
    }

    function sortByID(){
        itemOperations.sortbyid();
        printItemTable();
    }

    function sortByName(){
        itemOperations.sortbyname();
        printItemTable();
    }
    
    const saveItem = ()=>{
        var json = JSON.stringify(itemOperations.itemList);
         //objects stored in heap needs to be saved in hard disk but first they need to converted to a string in JSON form  
         if(localStorage){
             localStorage.mydata=json;
             alert("Data Saved");
         }
         else{
             alert("NO Support");
         }
     }
        
    const loadItem =()=>{
        if(localStorage){
            if(localStorage.mydata){
                var tempList = JSON.parse(localStorage.mydata);
                //this list consist only of data but not the functions present in it,so we create a new array list which is later added to the item object
                tempList.forEach(itemObject=>{
                    let item =new Item(itemObject.id,itemObject.name,itemObject.desc,itemObject.price,itemObject.color,itemObject.url,itemObject.date);
                    itemOperations.add(item);
                });
                printItemTable();
                updateCount();
            }
            else{
                alert("No Data in store");
            }
        }
    }
    
    function loadfromserver(){
        var xmlHttpReq= new XMLHttpRequest();
            xmlHttpReq.open("GET","http://localhost:5000/items");
            xmlHttpReq.onreadystatechange=function(){//binding is done earlier so that data is always avilable on call to server via send
                if(xmlHttpReq.readyState==4 && xmlHttpReq.status==200){
                   var obj=JSON.parse(xmlHttpReq.responseText);
                   printItem(obj);
                }
            }
            xmlHttpReq.send(null);        
    }
    
    function clearall(){
        document.querySelector("#itemid").value=" ";
        document.querySelector("#name").value=" ";
        document.querySelector("#price").value=00;
        updatePrice();
        document.querySelector("#url").value=" ";
        document.querySelector("#color").value=" ";
        document.querySelector("#date").value=" ";
        document.querySelector("#desc").value=" ";
    }
    

    //string can transfered over network while objecct can't be.
    //parse to convert string to object and stringify to convert object to string

    //Representational State transfer(REST) is used for webservices i.e programmer to programmer coding
    //Simple object App Based Protocol
    //http://freegeoip.net/json/google.com=>to get data of location ofserver
    
    //JSONPlaceholder =>Fake Online REST API for Testing and Prototyping
    //create a fake json file and add data to it key value pair
    //open termjson-server --watch fake.json --port 5000inal at that location
    //json-server --watch fake.json --port 5000
    //write this command in terminaal to create dummy server
    
    //EMCA 6 FEATURE
    // var w=100;
    // var v;
    // var g={w,v};
    // g=>{w:100,v:undefined};