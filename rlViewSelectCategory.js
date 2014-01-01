RL.view.selectCategory = function() {
    RL.view.model.build();
    var b = $("#_categoryDisplay");
    if (RL.view.model.filter_category != "all") {
        var d = $C("#_chatCategoryList").find("[data-cat-id=" + RL.view.model.filter_category + "]").find("span._categoryName").text();
        $("#_categoryDisplayTitle").text(d);
        b.isVisible() || 
        ($.cookie("ui_category", RL.view.model.filter_category, {expires: 3650}), b.show())
    } else
        b.isVisible() && ($.removeCookie("ui_category"), b.hide())
};
