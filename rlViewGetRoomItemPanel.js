var l = {showOrg: !1,showPin: !0,showSelected: !0,showRequest: !0,
    noTrim: !1};
RL.view.getRoomItemPanel = function(b, d) {
    var e = RL.view.model.rooms[b], f;
    if (d == void 0)
        f = l;
    else {
        f = {};
        for (var g in l)
            f[g] = l[g];
        for (g in d)
            f[g] = d[g]
    }
    var m = e.getUnreadNum(), o = 0;
    m > 0 && (o = e.getMentionNum());
    g = "_room";
    var s = "", u = "", t = "";
    f.showSelected && RM && RM.id == b && (g += " _roomSelected menuListTitleSelected");
    m > 0 && (g += " roomUnread", s = '<li role="listitem" class="_unreadBadge unread"><span class="icoFontActionUnread"></span>' + m + "</li>", o && (u = '<li class="_mentionLabel _unreadBadge mention"><span class="icoFontSideTo"></span>' + 
    o + "</li>", g += " roomMentionUnread"));
    e.mytask_num > 0 && (t = '<li><span class="icoFontActionTask"></span>' + e.mytask_num + "</li>");
    m = "";
    f.showPin && (m = e.sticky ? '<div class="chatListPin"><span class="_pin _pinRid' + e.id + ' ico19PinOn"></span></div>' : '<div class="chatListPin chatListPinOff"><span class="_pin _pinRid' + e.id + ' ico19PinOff"></span></div>');
    o = "";
    f.showRequest && e["public"] && e.member_request.length > 0 && (o = '<div class="alert alertWarning alertSmall"><span class="icoFontInfo marginRight"></span>' + L.chatroom_member_requests_notice.replace(/%%request_num%%/, 
    e.member_request.length) + "</div>");
    var v = "";
    if (f.showOrg && e.type == "contact") {
        var y = e.getAccountId();
        (y = CW.getOrgTitle(y)) && (v = '<p class="chatListOrgName">' + y + "</p>")
    }
    var x = y = "";
    s || u || t ? (f.noTrim || (y = " autotrim"), x = '<ul class="incomplete">' + s + u + t + "</ul>") : f.noTrim || (y = " chatListTitleNoLabel");
    f = "";
    CW.is_business && ST.data.show_external && (e.isInternal() || (f = '<div class="_externalMark roomOthers ico19Others"></div>'));
    return '<li role="listitem" aria-label="' + escape_html(e.getName()) + '" class="_roomLink ' + 
    g + '" data-rid="' + e.id + '"><div class="roomIcon">' + e.getIcon("html", "medium") + '</div><div class="chatListMeta"><p class="chatListTitleArea' + y + '">' + CW.getRoomName(e.id) + "</p>" + v + x + "</div>" + f + m + o + "</li>"
};
