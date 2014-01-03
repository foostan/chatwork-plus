// variables
// ============
RL.category_name_other = "other";

// methods
// ============
// variables
// ============
RL.category_name_other = "other";

// methods
// ============
RL.getCategories = function() {
  var categories = {};
  var default_category = {
    name              : "",
    list              : [],
    category_id       : null,
    order             : null,
    toggle            : false,
    notification      : true
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
  }
  categories[RL.category_name_other].name = RL.category_name_other;
  categories[RL.category_name_other].category_id = RL.category_name_other;
  categories[RL.category_name_other].list = [];

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

RL.build = function() {
  if (RL.has_update) {
    return RL.load();
  } else {

    var sorted_room_list = RL.getSortedRoomList();
    RL.filtered_room_list = [];

    var d = null, e = !1, k={};

    // prepare categories
    RL.filtered_categorized_rooms = RL.getCategories();
    jQuery.each(RL.filtered_categorized_rooms, function(category_id, rooms) {
      rooms.list.forEach(function(room_id){
        k[room_id] = category_id;
      });
      RL.filtered_categorized_rooms[category_id].list             = [];
      RL.filtered_categorized_rooms[category_id].unread_room_sum  = 0;
      RL.filtered_categorized_rooms[category_id].mention_room_sum = 0;
      RL.filtered_categorized_rooms[category_id].mytask_room_sum  = 0;
      RL.filtered_categorized_rooms[category_id].unread_total     = 0;
      RL.filtered_categorized_rooms[category_id].mytask_total     = 0;
    });

    RL.unread_room_sum  = 0;
    RL.mention_room_sum = 0;
    RL.mytask_room_sum  = 0;
    RL.unread_total     = 0;
    RL.mytask_total     = 0;
    for (var h = 0; h < sorted_room_list.length; h++) {
      var room        = RL.rooms[sorted_room_list[h]];
      var unread_num  = room.getUnreadNum()
      var mention_num = 0;

      if (unread_num > 0) {
        RL.unread_total += unread_num;
        RL.unread_room_sum++;
        mention_num = room.getMentionNum();
        if (mention_num > 0) {
          RL.mention_room_sum++;
        }
      }
      if (room.mytask_num > 0) {
        RL.mytask_total += room.mytask_num;
        RL.mytask_room_sum++;
      }

      // filter
      if (!RM || !(room.id == RM.id && RL.filter_remain_flag[room.id] != void 0)) {
        if (RL.filter_category == "contact" && room.type != "contact") {
          continue;
        }
        if (RL.filter_category == "group" && room.type != "group") {
          continue;
        }
        if (RL.filter_category == "mytask" && room.mytask_num == 0) {
          continue
        }
        if (RL.filter_readonly && unread_num == 0) {
          continue;
        }
        if (RL.filter_toonly && mention_num == 0) {
          continue;
        }
        if (RL.filter_taskonly && room.mytask_num == 0) {
          continue;
        }
        if (RL.filter_internalonly && !room.isInternal()) {
          continue
        }
      }

      // after
      RL.filter_remain_flag[room.id] = !0;


      if (k[room.id]) {
        category_id = k[room.id];
      } else {
        category_id = RL.category_name_other;
      }

      RL.filtered_categorized_rooms[category_id].list.push(sorted_room_list[h]);

      if (unread_num > 0) {
        RL.filtered_categorized_rooms[category_id].unread_total += unread_num;
        RL.filtered_categorized_rooms[category_id].unread_room_sum++;
        mention_num = room.getMentionNum();
        if (mention_num > 0) {
          RL.filtered_categorized_rooms[category_id].mention_room_sum++;
        }
      }
      if (room.mytask_num > 0) {
        RL.filtered_categorized_rooms[category_id].mytask_total += room.mytask_num;
        RL.filtered_categorized_rooms[category_id].mytask_room_sum++;
      }
    }

    RL.view.build(RL.filtered_categorized_rooms);

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

RL.toggleCategory = function(category_id) {
  categories = RL.getCategories();
  if (categories[category_id].toggle === true) {
    categories[category_id].toggle = false;
  } else {
    categories[category_id].toggle = true;
  }
  RL.setCategories(categories);
  RL.build();
}

// view methods
// ============
RL.view.build = function(categorized_rooms) {
  RL.view.model.prepareRM();
  var d = "";
  $C("#_chatListEmptyArea").hide();
  $chatCategoryTitle = $("<li>").addClass("chatCategoryTitle");

  RL.getSortedCategoryList().forEach(function(category){
    var category_id = category.category_id;
    var rooms = categorized_rooms[category_id];

    if (category_id != RL.category_name_other) {
      title = $C("#_chatCategoryList").find("[data-cat-id=" + category_id + "]").find("span._categoryName").text();
    } else {
      title = category_id
    }

    if (rooms.toggle === true) {
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

    if (rooms.unread_total > 0) {
      $unread_badge = $("<li>").addClass("_unreadBadge").addClass("unread")
        .append($("<span>").addClass("icoFontActionUnread"))
        .append($("<span>").text(rooms.unread_total));
    } else {
      $unread_badge = null;
    }

    if (rooms.mention_room_sum > 0) {
      $mention_badge = $("<li>").addClass("_unreadBadge").addClass("unread")
        .append($("<span>").addClass("icoFontTo"))
        .append($("<span>").text(rooms.mention_room_sum));
    } else {
      $mention_badge = null;
    }

    if (rooms.mytask_total > 0) {
      $mytask_badge = $("<li>")
        .append($("<span>").addClass("icoFontActionTask"))
        .append($("<span>").text(rooms.mytask_total));
    } else {
      $mytask_badge = null;
    }

    $title_group = $("<ul>").addClass("incomplete")
      .append($title)
      .append($unread_badge)
      .append($mention_badge)
      .append($mytask_badge);

    d += $chatCategoryTitle
      .attr("category_id", category_id)
      .html($title_group[0].outerHTML)[0].outerHTML;

    if (rooms.toggle === true) {
      l = Math.min(rooms.list.length, RL.view.room_show_limit);
      for (var g = 0; g < l; g++) {
        $room = $(RL.view.getRoomItemPanel(rooms.list[g]));
        $room.attr('category_id', category_id);
        d += $room[0].outerHTML;
      }
    }

  });

  $C("#_roomListItems").html(d);
  room_id = RL.getFocusedRoomId();
  room_id > 0 && RL.view.model.focusRoom(room_id)
};

RL.view.selectCategory = function() {
  $("#_categoryDisplay").hide();
};


// events
// ===========
$(document).on("click", ".chatCategoryTitle",function(){
  category_id = $(this).attr("category_id");
  RL.toggleCategory(category_id)
});




