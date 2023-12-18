function printScreen(printlist) {
    //var value = printlist.innerHTML;
    var printPage = window.open("", "Printing...", "");
    printPage.document.open();
    printPage.document.write("<HTML><head></head><BODY onload='window.print();window.close()'>");
    printPage.document.write("<PRE>");
    printPage.document.write(printlist);
    printPage.document.write("</PRE>");
    printPage.document.close("</BODY></HTML>");
}