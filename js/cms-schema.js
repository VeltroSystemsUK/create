// js/cms-schema.js
// Auto-detects editable content fields from block definitions.
// Called during export to generate cms-schema.json.

FB.cms = FB.cms || {};

// Props that are always treated as content (editable)
FB.cms.CONTENT_PROPS = new Set([
  "headline",
  "title",
  "text",
  "subtext",
  "body",
  "description",
  "caption",
  "quote",
  "eyebrow",
  "name",
  "label",
  "btnText",
  "ctaText",
  "message",
  "greeting",
  "placeholder",
  "btnText",
  "acceptText",
  "declineText",
  "emptyText",
  "checkoutBtnText",
  "triggerText",
  "variant",
  "heading",
  "tagline",
  "brandName",
  "logoText",
  "suffix",
  "prefix",
  "dayText",
  "nightText",
  "resultsText",
  "ratingText",
  "verifiedDate",
]);

// Props that are always treated as design (locked)
FB.cms.DESIGN_PROPS = new Set([
  "bg",
  "textColor",
  "accentColor",
  "saleColor",
  "starColor",
  "paddingV",
  "paddingH",
  "gap",
  "columns",
  "imageHeight",
  "imageFit",
  "imageRadius",
  "imagePosition",
  "textAlign",
  "menuStyle",
  "blobStyle",
  "showBlob",
  "showPriceRange",
  "showGridToggle",
  "overlayOpacity",
  "taxRate",
  "modalBg",
  "speed",
  "targetDate",
  "currentAmount",
  "threshold",
  "rating",
  "reviewCount",
  "ratingCount",
  "cardsVisible",
  "imagePosition",
  "imageFit",
  "imageRadius",
  "imageHeight",
]);

// Check if a value looks like editable content
FB.cms._isContentValue = function (val) {
  if (typeof val === "string" && val.length > 0 && val.length < 2000) {
    if (
      val.startsWith("http") &&
      /\.(jpg|png|gif|webp|svg|mp4|webm)/i.test(val)
    )
      return true;
    if (!val.startsWith("#")) return true;
    return false;
  }
  return false;
};

FB.cms.generateSchema = function () {
  var schema = { pages: [] };
  FB.state.pages.forEach(function (page) {
    var pageSchema = {
      pageId: page.id,
      name: page.name,
      slug: page.slug,
      blocks: [],
    };
    var blocks =
      page.id === FB.state.currentPageId ? FB.state.blocks : page.blocks;
    blocks.forEach(function (block) {
      var blockSchema = { blockId: block.id, type: block.type, fields: {} };
      var def =
        FB.blocks.BLOCK_DEFS[block.type] ||
        FB.blocks.CUSTOM_BLOCK_DEFS[block.type] ||
        FB.blocks.ECOMMERCE_DEFS[block.type] ||
        FB.widgets._registry[block.type];
      if (!def) return;
      Object.keys(def.defaultProps).forEach(function (propName) {
        var isContent = FB.cms.CONTENT_PROPS.has(propName);
        var isDesign = FB.cms.DESIGN_PROPS.has(propName);
        var val = block.props[propName];
        var valType = Array.isArray(val)
          ? "array"
          : val === null
            ? "null"
            : typeof val;
        var editable = false;
        var fieldType = "string";
        if (isContent) {
          editable = true;
        } else if (isDesign) {
          editable = false;
        } else {
          if (valType === "string") {
            if (/url|src|link|image|photo|avatar|logo|icon/i.test(propName)) {
              editable = true;
              fieldType = "image";
            } else if (/color|bg|background/i.test(propName)) {
              editable = false;
            } else {
              editable = FB.cms._isContentValue(val);
            }
          } else if (valType === "array") {
            editable =
              val.length > 0 &&
              val.every(function (item) {
                return typeof item === "string";
              });
            if (editable) fieldType = "list";
          } else if (valType === "number" || valType === "boolean") {
            editable = false;
          }
        }
        blockSchema.fields[propName] = {
          editable: editable,
          type: fieldType,
          label: propName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (s) {
              return s.toUpperCase();
            }),
        };
      });
      // Complex sub-fields for blocks with nested data
      if (block.type === "team" && block.props.members) {
        blockSchema.fields["members"] = {
          editable: true,
          type: "collection",
          label: "Team Members",
          itemFields: {
            name: { editable: true, type: "string", label: "Name" },
            role: { editable: true, type: "string", label: "Role" },
            imageUrl: { editable: true, type: "image", label: "Photo" },
          },
        };
      }
      if (block.type === "pricing" && block.props.plans) {
        blockSchema.fields["plans"] = {
          editable: true,
          type: "collection",
          label: "Pricing Plans",
          itemFields: {
            name: { editable: true, type: "string", label: "Plan Name" },
            price: { editable: true, type: "string", label: "Price" },
            period: { editable: true, type: "string", label: "Period" },
            features: { editable: true, type: "list", label: "Features" },
            cta: { editable: true, type: "string", label: "Button Text" },
          },
        };
      }
      if (block.type === "faq" && block.props.items) {
        blockSchema.fields["items"] = {
          editable: true,
          type: "collection",
          label: "FAQ Items",
          itemFields: {
            q: { editable: true, type: "string", label: "Question" },
            a: { editable: true, type: "richtext", label: "Answer" },
          },
        };
      }
      if (
        (block.type === "nav" ||
          block.type === "slideNav" ||
          block.type === "fullscreenMenu") &&
        block.props.links
      ) {
        blockSchema.fields["links"] = {
          editable: true,
          type: "list",
          label: "Navigation Links",
        };
      }
      if (block.type === "footer" && block.props.columns) {
        blockSchema.fields["columns"] = {
          editable: true,
          type: "collection",
          label: "Footer Columns",
          itemFields: {
            heading: {
              editable: true,
              type: "string",
              label: "Column Heading",
            },
            links: { editable: true, type: "list", label: "Links" },
          },
        };
      }
      if (block.props.imageUrl && blockSchema.fields["imageUrl"])
        blockSchema.fields["imageUrl"].type = "image";
      if (block.props.avatarUrl && blockSchema.fields["avatarUrl"])
        blockSchema.fields["avatarUrl"].type = "image";
      if (block.props.logoUrl && blockSchema.fields["logoUrl"])
        blockSchema.fields["logoUrl"].type = "image";
      pageSchema.blocks.push(blockSchema);
    });
    schema.pages.push(pageSchema);
  });
  return schema;
};

FB.cms.generateContent = function () {
  var content = { pages: {} };
  FB.state.pages.forEach(function (page) {
    var blocks =
      page.id === FB.state.currentPageId ? FB.state.blocks : page.blocks;
    var pageContent = { blocks: {} };
    blocks.forEach(function (block) {
      var blockContent = {};
      var schema = FB.cms.generateSchema();
      var pageSchema = schema.pages.find(function (p) {
        return p.pageId === page.id;
      });
      if (!pageSchema) return;
      var blockSchema = pageSchema.blocks.find(function (b) {
        return b.blockId === block.id;
      });
      if (!blockSchema) return;
      Object.keys(blockSchema.fields).forEach(function (key) {
        if (
          blockSchema.fields[key].editable &&
          block.props[key] !== undefined
        ) {
          blockContent[key] = JSON.parse(JSON.stringify(block.props[key]));
        }
      });
      if (Object.keys(blockContent).length > 0)
        pageContent.blocks[block.id] = blockContent;
    });
    if (Object.keys(pageContent.blocks).length > 0)
      content.pages[page.id] = pageContent;
  });
  return content;
};
