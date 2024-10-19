const mongoose = require("mongoose");
const { string } = require("yargs");

const PdfDetailsSchema=new mongoose.Schema({
    pdf:String,
    title:String,
    image:String
},{collection:"PdfDetails"})

mongoose.model("PdfDetails", PdfDetailsSchema);