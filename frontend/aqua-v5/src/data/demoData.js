export const tankers = [
  {id:1, quantity:"6000 L", price:600},
  {id:2, quantity:"8000 L", price:800},
  {id:3, quantity:"10000 L", price:900},
  {id:4, quantity:"12000 L", price:1050},
  {id:5, quantity:"15000 L", price:1250}
];

export const vendors = [
  {id:1,name:"Vendor 1",extra:0,verified:true,onTime:true},
  {id:2,name:"Vendor 2",extra:30,verified:true,onTime:true},
  {id:3,name:"Vendor 3",extra:50,verified:true,onTime:false,pump:true},
  {id:4,name:"Vendor 4",extra:80,verified:true,onTime:true},
  {id:5,name:"Vendor 5",extra:120,verified:false,onTime:true,pump:true}
];

export const timeSlots = [
  {label:"09:00AM - 11:00AM",status:"available"},
  {label:"11:00AM - 01:00PM",status:"booked"},
  {label:"01:00PM - 03:00PM",status:"booked"},
  {label:"03:00PM - 05:00PM",status:"available"},
  {label:"05:00PM - 07:00PM",status:"available"},
  {label:"07:00PM - 09:00PM",status:"available"},
  {label:"09:00PM - 11:00PM",status:"booked"}
];
