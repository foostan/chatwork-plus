RL.view.build = function(b) {
    console.log(b);
    RL.view.model.prepareRM();
    var d = "", e = b.length, f = e;
    if (e) {
        $C("#_chatListEmptyArea").hide();
        if (e > RL.view.room_show_limit)
            f = RL.view.room_show_limit;
        for (var g = 0; g < f; g++)
            b[g] != void 0 && (d += RL.view.getRoomItemPanel(b[g]));
        e > f && (d += '<div class="roomLimitOver"><div>' + L.chat_rest_roomtip + (e - RL.view.room_show_limit) + 
        '</div><div id="_roomMore" class="button">' + L.chat_show_more + "</div></div>");
        $C("#_roomListItems").html(d);
        b = RL.getFocusedRoomId();
        b > 0 && RL.view.model.focusRoom(b)
    } else
        $C("#_roomListItems").quickEmpty(), $C("#_chatListEmptyArea ._chatListEmpty").hide(), RL.view.model.filter_readonly ? $C("#_chatListUnreadEmpty").show() : RL.view.model.filter_toonly ? $C("#_chatListToEmpty").show() : RL.view.model.filter_taskonly && $C("#_chatListTaskEmpty").show(), $C("#_chatListEmptyArea").show()
};

RL.view.build2 = function(b) {
    RL.view.model.prepareRM();
    var d = "", e = b.length, f = e;
    if (e) {
        $C("#_chatListEmptyArea").hide();



        
        for (var i = 0; i < b.length; i++) {
            d += "<li>hoge</li>"
            e = b[i].length, f = e;

            if (e > RL.view.room_show_limit)
                f = RL.view.room_show_limit;
            for (var g = 0; g < f; g++)
                b[i][g] != void 0 && (d += RL.view.getRoomItemPanel(b[i][g]));
        }

        console.log(d);



            e > f && (d += '<div class="roomLimitOver"><div>' + L.chat_rest_roomtip + (e - RL.view.room_show_limit) + 
        '</div><div id="_roomMore" class="button">' + L.chat_show_more + "</div></div>");



        $C("#_roomListItems").html(d);
        b = RL.getFocusedRoomId();
        b > 0 && RL.view.model.focusRoom(b)




    } else
        $C("#_roomListItems").quickEmpty(), $C("#_chatListEmptyArea ._chatListEmpty").hide(), RL.view.model.filter_readonly ? $C("#_chatListUnreadEmpty").show() : RL.view.model.filter_toonly ? $C("#_chatListToEmpty").show() : RL.view.model.filter_taskonly && $C("#_chatListTaskEmpty").show(), $C("#_chatListEmptyArea").show()
};
