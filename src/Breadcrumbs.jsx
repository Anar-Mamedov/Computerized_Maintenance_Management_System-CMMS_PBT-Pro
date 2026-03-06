import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { rawItems } from "./menuItems";

// rawItems'dan parent-child ilişkisini otomatik oluşturur
function buildHierarchy(items, parent = null, subParent = null) {
  const map = {};
  items.forEach((item) => {
    if (item.children) {
      // Alt grubu olan menü (Onay İşlemleri gibi nested group)
      if (parent) {
        // Bu bir sub-parent (örn: Yönetim > Onay İşlemleri)
        buildHierarchyInto(map, item.children, parent, item.labelText);
      } else {
        // Bu bir parent (örn: Yönetim, Bakım Yönetimi)
        buildHierarchyInto(map, item.children, item.labelText, null);
      }
    }
  });
  return map;
}

function buildHierarchyInto(map, children, parent, subParent) {
  children.forEach((child) => {
    if (child.children) {
      // Nested group (örn: Onay İşlemleri)
      buildHierarchyInto(map, child.children, parent, child.labelText);
    } else if (child.key) {
      map[child.key] = {
        parent,
        subParent,
        label: child.labelText,
      };
    }
  });
}

const menuHierarchy = buildHierarchy(rawItems);

const Breadcrumbs = () => {
  const location = useLocation();
  const pathKey = location.pathname.replace("/", "");

  const items = [
    {
      key: "home",
      title: <Link to="/">Ana Sayfa</Link>,
    },
  ];

  const hierarchy = menuHierarchy[pathKey];

  if (hierarchy) {
    items.push({
      key: "parent",
      title: hierarchy.parent,
    });

    if (hierarchy.subParent) {
      items.push({
        key: "subParent",
        title: hierarchy.subParent,
      });
    }

    items.push({
      key: "current",
      title: hierarchy.label,
    });
  } else if (pathKey) {
    items.push({
      key: "current",
      title: pathKey,
    });
  }

  return <Breadcrumb style={{ margin: "7px 0" }} items={items} />;
};

export default Breadcrumbs;
