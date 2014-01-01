RL.build = function() {
    if (RL.has_update)
        return RL.load();
    else {
        RL.filtered_room_lists = [];
        categories = [];
        jQuery.each(RL.category_dat, function(id, category) {
            categories.push(id);
        });
        categories.push("");

        for (var ite = 0; ite < categories.length; ite++) {
            RL.filter_category = categories[ite];
            var a = RL.getSortedRoomList();
            RL.filtered_room_list = [];
            var d = null, e = !1, k = {};
            if (RL.filter_category && !RL.category_defaults[RL.filter_category])
                for (var e = 
                     !0, d = 0, i = RL.category_dat[RL.filter_category].list.length; d < i; d++)
                    k[RL.category_dat[RL.filter_category].list[d]] = !0;
            RL.unread_room_sum = 0;
            RL.mention_room_sum = 0;
            RL.mytask_room_sum = 0;
            RL.unread_total = 0;
            RL.mytask_total = 0;
            i = [];
            RL.filter_word && (i = CW.splitWithSpace(RL.filter_word));
            for (var h = 0; h < a.length; h++)
            if (a[h] != void 0) {
                var d = RL.rooms[a[h]], j = d.getUnreadNum(), n = 0;
                j > 0 && (RL.unread_total += j, RL.unread_room_sum++, n = d.getMentionNum(), n > 0 && RL.mention_room_sum++);
                d.mytask_num > 0 && (RL.mytask_total += d.mytask_num, RL.mytask_room_sum++);
                if (i.length > 0) {
                    j = d.getName();
                    if (!j)
                        continue;
                    if (d.type == "contact") {
                        if (!AC.isMatchedWithKeyList(i, d.getAccountId()))
                            continue
                    } else if (!CW.isMatchedWithKeyList(i, j))
                        continue
                } else if (!RM || !(d.id == RM.id && RL.filter_remain_flag[d.id] != void 0)) {
                    if (e) {
                        if (k[d.id] != !0)
                            continue
                    } else {
                        if (RL.filter_category == "contact" && d.type != "contact")
                            continue;
                        if (RL.filter_category == "group" && d.type != "group")
                            continue;
                        if (RL.filter_category == "mytask" && d.mytask_num == 0)
                            continue
                    }
                    if (RL.filter_readonly && j == 0)
                        continue;
                    if (RL.filter_toonly && n == 
                        0)
                        continue;
                    if (RL.filter_taskonly && d.mytask_num == 0)
                        continue;
                    if (RL.filter_internalonly && !d.isInternal())
                        continue
                }
                RL.filter_remain_flag[d.id] = !0;
                RL.filtered_room_list.push(a[h])
            }

            RL.filtered_room_lists.push(RL.filtered_room_list);






        }

        console.log(RL.filtered_room_lists);

        //RL.view.build2(RL.filtered_room_lists);

        RL.view.updateSumNumbers();
        if (RL.lazy_select)
            if (RL.rooms[RL.lazy_select] != void 0)
                RL.selectRoom(RL.lazy_select, RL.lazy_select_chat), RL.lazy_select = 0, RL.lazy_select_chat = 0;
        else {
            if (RM)
                RL.lazy_select = 0, RL.lazy_select_chat = 0, CW.alert(L.chatroom_error_no_member, function() {
                    RL.selectRoom(RM.id)
                })
        }
        else
            RL.rebuild_room && 
            RM && RM.build();
        RL.rebuild_room = !1
    }
};
