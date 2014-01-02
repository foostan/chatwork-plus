RL.build = function() {
  if (RL.has_update) {
    return RL.load();
  } else {

    var a = RL.getSortedRoomList();
    RL.filtered_room_list = [];
    RL.filtered_room_lists = {};
    RL.category_dat[RL.category_name_other] = {};

    var d = null, e = !1, k={};

    // prepare categories
    jQuery.each(RL.category_dat, function(id, category) {
      RL.filtered_room_lists[id] = [];
      RL.category_dat[id].unread_room_sum = 0;
      RL.category_dat[id].mention_room_sum = 0;
      RL.category_dat[id].mytask_room_sum = 0;
      RL.category_dat[id].unread_total = 0;
      RL.category_dat[id].mytask_total = 0;

      if (category.list) {
        category.list.forEach(function(n){
          k[n] = id;
        })
      }
    });
    RL.filtered_room_lists['other'] = [];

    RL.unread_room_sum = 0;
    RL.mention_room_sum = 0;
    RL.mytask_room_sum = 0;
    RL.unread_total = 0;
    RL.mytask_total = 0;
    for (var h = 0; h < a.length; h++) {
      // sum
      var d = RL.rooms[a[h]], j = d.getUnreadNum(), n = 0;

      if (j > 0) {
        RL.unread_total += j
        RL.unread_room_sum++
        n = d.getMentionNum()
        if (n > 0) {
          RL.mention_room_sum++;
        }
      }
      if (d.mytask_num > 0) {
        RL.mytask_total += d.mytask_num;
        RL.mytask_room_sum++;
      }

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
      if (k[d.id]) {
        RL.filtered_room_lists[k[d.id]].push(a[h])

        if (j > 0) {
          RL.category_dat[k[d.id]].unread_total += j
          RL.category_dat[k[d.id]].unread_room_sum++
          n = d.getMentionNum()
          if (n > 0) {
            RL.category_dat[k[d.id]].mention_room_sum++
          }
        }
        if (d.mytask_num > 0) {
          RL.category_dat[k[d.id]].mytask_total += d.mytask_num;
          RL.category_dat[k[d.id]].mytask_room_sum++;
        }
      } else {
        RL.filtered_room_lists['other'].push(a[h])

        if (j > 0) {
          RL.category_dat['other'].unread_total += j
          RL.category_dat['other'].unread_room_sum++
          n = d.getMentionNum()
          if (n > 0) {
            RL.category_dat['other'].mention_room_sum++
          }
        }
        if (d.mytask_num > 0) {
          RL.category_dat['other'].mytask_total += d.mytask_num;
          RL.category_dat['other'].mytask_room_sum++;
        }
      }
    }

    //RL.view.build(RL.filtered_room_list);
    RL.view.build(RL.filtered_room_lists);

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

RL.view.build = function(room_lists) {
  //console.log(room_lists);



  RL.view.model.prepareRM();
  var d = "";
  $C("#_chatListEmptyArea").hide();
  $chatCategoryTitle = $("<li>").addClass("chatCategoryTitle");

  jQuery.each(room_lists, function(room_id, rooms) {
    toggle = localStorage.getItem("room_id_" + room_id);
    if (toggle == undefined) {
      localStorage.setItem("room_id_" + room_id, "on");
      toggle = "on";
    }

    if (room_id != RL.category_name_other) {
      title = $C("#_chatCategoryList").find("[data-cat-id=" + room_id + "]").find("span._categoryName").text();
    } else {
      title = room_id
    }


    if (toggle === "on") {
      $title = $("<li>").addClass("_unreadBadge")
        .append($("<span>").addClass("icoFontTriangleDown"))
        .append($("<span>")
          .text(title));
    } else {
      $title = $("<li>").addClass("_unreadBadge")
        .append($("<span>").addClass("icoFontTriangleRight"))
        .append($("<span>")
          .text(title));
    }


    if (RL.category_dat[room_id].unread_total > 0) {
      $unread_badge = $("<li>").addClass("_unreadBadge").addClass("unread")
        .append($("<span>").addClass("icoFontActionUnread"))
        .append($("<span>").text(RL.category_dat[room_id].unread_total));
    } else {
      $unread_badge = null;
    }

    if (RL.category_dat[room_id].mention_room_sum > 0) {
      $mention_badge = $("<li>").addClass("_unreadBadge").addClass("unread")
        .append($("<span>").addClass("icoFontTo"))
        .append($("<span>").text(RL.category_dat[room_id].mention_room_sum));
    } else {
      $mention_badge = null;
    }

    if (RL.category_dat[room_id].mytask_total > 0) {
      $mytask_badge = $("<li>")
        .append($("<span>").addClass("icoFontActionTask"))
        .append($("<span>").text(RL.category_dat[room_id].mytask_total));
    } else {
      $mytask_badge = null;
    }

    $title_group = $("<ul>").addClass("incomplete")
      .append($title)
      .append($unread_badge)
      .append($mention_badge)
      .append($mytask_badge);

    d += $chatCategoryTitle
      .attr("room_id", room_id)
      .attr("toggle", toggle)
      .html($title_group[0].outerHTML)[0].outerHTML;

    l = Math.min(rooms.length, RL.view.room_show_limit);
    //console.log(l);
    for (var g = 0; g < l; g++) {
      $room = $(RL.view.getRoomItemPanel(rooms[g]));
      $room.attr('room_id', room_id);
      d += $room[0].outerHTML;
    }

    //if (rooms.length > RL.view.room_show_limit) {
    //  d += '<div class="roomLimitOver"><div>' + L.chat_rest_roomtip + (rooms.length - RL.view.room_show_limit) +
    //    '</div><div id="_roomMore" class="button">' + L.chat_show_more + "</div></div>";
    //}

  });



  $C("#_roomListItems").html(d);
  $(".chatCategoryTitle").each(function(){
    RL.updateCategoryToggle($(this));
  })
  room_id = RL.getFocusedRoomId();
  room_id > 0 && RL.view.model.focusRoom(room_id)
};

RL.view.selectCategory = function() {
  $("#_categoryDisplay").hide();
};

$(document).on("click", ".chatCategoryTitle",function(){
  $chatCategoryTitle = $(this);
  room_id = $chatCategoryTitle.attr("room_id");
  toggle  = $chatCategoryTitle.attr("toggle");

  if (toggle == "on") {
    $chatCategoryTitle
    $chatCategoryTitle.attr("toggle", "off");
    localStorage.setItem("room_id_" + room_id, "off");
  } else {
    $chatCategoryTitle.attr("toggle", "on");
    localStorage.setItem("room_id_" + room_id, "on");
  }

  RL.updateCategoryToggle($(this))
});

RL.updateCategoryToggle = function($chatCategoryTitle) {
  room_id = $chatCategoryTitle.attr("room_id");
  toggle  = $chatCategoryTitle.attr("toggle");

  $("[room_id=" + room_id + "][role=listitem]").each(function(){
    if (toggle == "on") {
      $chatCategoryTitle.find(".icoFontTriangleRight")
        .removeClass("icoFontTriangleRight")
        .addClass("icoFontTriangleDown");
      $(this).show();
    } else {
      $chatCategoryTitle.find(".icoFontTriangleDown")
        .removeClass("icoFontTriangleDown")
        .addClass("icoFontTriangleRight");
      $(this).hide();
    }
  });
}



RL.category_name_other = "ohter";

RL.getCategories = function() {
  var categories = {};
  var default_category = {
    name: "",
    list: [],
    category_id: null,
    order: null,
    toggle: false,
    notification: true
  }

  if (localStorage["categories"]) {
    categories = JSON.parse(localStorage["categories"]);
  }

  jQuery.each(RL.category_dat, function(id, category) {
    if (!categories[id]) {
      categories[id] = $.extend({}, default_category);
    }
    categories[id].name = category.name;
    categories[id].category_id = id;
    categories[id].list = category.list;
  });
  if (!categories[RL.category_name_other]) {
    categories[RL.category_name_other] = default_category;
    categories[RL.category_name_other].name = RL.category_name_other;
    categories[RL.category_name_other].category_id = RL.category_name_other;
  }

  RL.setCategories(categories);
  return categories;
}

RL.setCategories = function(categories) {
  localStorage["categories"] = JSON.stringify(categories);
}

RL.setCategoryList = function(category_list) {
  var categories = {};
  category_list.forEach(function(category){
    categories[category.category_id] = category;
  });

  console.log(categories);

  RL.setCategories(categories);
}

RL.getSortedCategoryList = function() {
  var category_list = [];

  jQuery.each(RL.getCategories(), function(id, category) {
    category_list.push(category);
  });

  return RL.sortCategoryList(category_list);
}

RL.sortCategoryList = function(category_list) {
  category_list.sort(
    function(a,b){
      if(a.order === null && b.order === null) return 0;
      if(a.order === null) return 1;
      if(b.order === null) return -1;
      if(a.order < b.order) return -1;
      if(a.order > b.order) return 1;
      return 0;
    }
  );

  return category_list;
}

