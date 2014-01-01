RL.build = function() {
  if (RL.has_update) {
    return RL.load();
  } else {

    var a = RL.getSortedRoomList();
    RL.filtered_room_list = [];
    RL.filtered_room_lists = {};

    var d = null, e = !1, k={};

    // prepare categories
    jQuery.each(RL.category_dat, function(id, category) {
      RL.filtered_room_lists[id] = [];
      category.list.forEach(function(n){
        k[n] = id;
      })
    });
    RL.filtered_room_lists[0] = [];

    RL.unread_room_sum = 0;
    RL.mention_room_sum = 0;
    RL.mytask_room_sum = 0;
    RL.unread_total = 0;
    RL.mytask_total = 0;
    for (var h = 0; h < a.length; h++) {
      // sum
      var d = RL.rooms[a[h]], j = d.getUnreadNum(), n = 0;
      j > 0 && (RL.unread_total += j, RL.unread_room_sum++, n = d.getMentionNum(), n > 0 && RL.mention_room_sum++);
      d.mytask_num > 0 && (RL.mytask_total += d.mytask_num, RL.mytask_room_sum++);

      // filter
      if (!RM || !(d.id == RM.id && RL.filter_remain_flag[d.id] != void 0)) {
        if (RL.filter_category == "contact" && d.type != "contact") {
          continue;
        }
        if (RL.filter_category == "group" && d.type != "group") {
          continue;
        }
        if (RL.filter_category == "mytask" && d.mytask_num == 0) {
          continue
        }
        if (RL.filter_readonly && j == 0) {
          continue;
        }
        if (RL.filter_toonly && n == 0) {
          continue;
        }
        if (RL.filter_taskonly && d.mytask_num == 0) {
          continue;
        }
        if (RL.filter_internalonly && !d.isInternal()) {
          continue
        }
      }

      // after
      RL.filter_remain_flag[d.id] = !0;
      RL.filtered_room_list.push(a[h])
      if (k[d.id]) {
        RL.filtered_room_lists[k[d.id]].push(a[h])
      } else {
        RL.filtered_room_lists[0].push(a[h])
      }
    }

    //RL.view.build(RL.filtered_room_list);
    RL.view.build2(RL.filtered_room_lists);

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
