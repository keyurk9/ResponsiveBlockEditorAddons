import fontOptions from "../../../utils/googlefonts";
import BoxShadowControl from "../../../utils/components/box-shadow";
import BoxShadowControlHelper from "../../../utils/components/box-shadow-helper";

/**
 * Inspector Controls
 */

// Setup the block
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { AlignmentToolbar } = wp.editor;

import compact from "lodash/compact";
import map from "lodash/map";
import { loadGoogleFont } from "../../../utils/font";

// Import block components
const { InspectorControls, ColorPalette } = wp.blockEditor;

// Import Inspector components
const {
  PanelBody,
  QueryControls,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
  TabPanel,
  Dashicon,
} = wp.components;

const { addQueryArgs } = wp.url;

const { apiFetch } = wp;

const MAX_POSTS_COLUMNS = 4;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
  constructor() {
    super(...arguments);
    this.state = { categoriesList: [] };
    this.onSelectTaxonomyType = this.onSelectTaxonomyType.bind(this);
  }
    onSelectTaxonomyType(value) {
        const { setAttributes } = this.props;
        setAttributes({ taxonomyType: value });
        setAttributes({ categories: "" });
    }

    componentDidMount() {
    this.stillMounted = true;
    this.fetchRequest = apiFetch({
      path: addQueryArgs("/wp/v2/categories", { per_page: -1 }),
    })
      .then((categoriesList) => {
        if (this.stillMounted) {
          this.setState({ categoriesList });
        }
      })
      .catch(() => {
        if (this.stillMounted) {
          this.setState({ categoriesList: [] });
        }
      });
  }

  componentWillUnmount() {
    this.stillMounted = false;
  }

  /* Get the available image sizes */
  imageSizeSelect() {
    const getSettings = wp.data.select("core/editor").getEditorSettings();

    return compact(
      map(getSettings.imageSizes, ({ name, slug }) => {
        return {
          value: slug,
          label: name,
        };
      })
    );
  }

  render() {
    // Setup the attributes
    const { attributes, setAttributes, latestPosts, taxonomyList } = this.props;

    const { order, orderBy } = attributes;

    const { categoriesList } = this.state;

    const fontWeightOptions = [
      {
        value: "100",
        label: __("100", "responsive-block-editor-addons"),
      },
      {
        value: "200",
        label: __("200", "responsive-block-editor-addons"),
      },
      {
        value: "300",
        label: __("300", "responsive-block-editor-addons"),
      },
      {
        value: "400",
        label: __("400", "responsive-block-editor-addons"),
      },
      {
        value: "500",
        label: __("500", "responsive-block-editor-addons"),
      },
      {
        value: "600",
        label: __("600", "responsive-block-editor-addons"),
      },
      {
        value: "700",
        label: __("700", "responsive-block-editor-addons"),
      },
      {
        value: "800",
        label: __("800", "responsive-block-editor-addons"),
      },
      {
        value: "900",
        label: __("900", "responsive-block-editor-addons"),
      },
    ];

    const textTransformOptions = [
      {
        value: "",
        label: __("Default", "responsive-block-editor-addons"),
      },
      {
        value: "uppercase",
        label: __("Uppercase", "responsive-block-editor-addons"),
      },
      {
        value: "lowercase",
        label: __("Lowercase", "responsive-block-editor-addons"),
      },
      {
        value: "capitalize",
        label: __("Capitalize", "responsive-block-editor-addons"),
      },
    ];

    const postTaxonomyOptions = [
      {
        value: "category",
        label: __("Category", "responsive-block-editor-addons"),
      },
      { value: "tag", label: __("Tag", "responsive-block-editor-addons") },
    ];

    // Section title tags
    const sectionTags = [
      { value: "div", label: __("div", "responsive-block-editor-addons") },
      {
        value: "header",
        label: __("header", "responsive-block-editor-addons"),
      },
      {
        value: "section",
        label: __("section", "responsive-block-editor-addons"),
      },
      {
        value: "article",
        label: __("article", "responsive-block-editor-addons"),
      },
      { value: "main", label: __("main", "responsive-block-editor-addons") },
      { value: "aside", label: __("aside", "responsive-block-editor-addons") },
      {
        value: "footer",
        label: __("footer", "responsive-block-editor-addons"),
      },
    ];

    // Section title tags
    const sectionTitleTags = [
      { value: "h2", label: __("H2", "responsive-block-editor-addons") },
      { value: "h3", label: __("H3", "responsive-block-editor-addons") },
      { value: "h4", label: __("H4", "responsive-block-editor-addons") },
      { value: "h5", label: __("H5", "responsive-block-editor-addons") },
      { value: "h6", label: __("H6", "responsive-block-editor-addons") },
    ];

    // Check for posts
    const hasPosts = Array.isArray(latestPosts) && latestPosts.length;

    // Check the post type
    const isPost = "post" === attributes.postType;

    // Add instruction text to the select
    const abImageSizeSelect = {
      value: "selectimage",
      label: __("Select image size"),
    };

    // Get the image size options
    const imageSizeOptions = this.imageSizeSelect();

    imageSizeOptions.unshift(abImageSizeSelect);

    const imageSizeValue = () => {
      for (let i = 0; i < imageSizeOptions.length; i++) {
        if (imageSizeOptions[i].value === attributes.imageSize) {
          return attributes.imageSize;
        }
      }
      return "full";
    };

    let taxonomyListOptions = [];

    let categoryListOptions = [{ value: "", label: __("All") }];

    if ("" != taxonomyList) {
      Object.keys(taxonomyList).map((item, thisIndex) => {
        return taxonomyListOptions.push({
          value: taxonomyList[item]["name"],
          label: taxonomyList[item]["label"],
        });
      });
    }

    if ("" != categoriesList) {
      Object.keys(categoriesList).map((item, thisIndex) => {
        return categoryListOptions.push({
          value: categoriesList[item]["id"],
          label: categoriesList[item]["name"],
        });
      });
    }

    return (
      <InspectorControls>
        <PanelBody
          title={__(
            "Post and Page Grid Settings",
            "responsive-block-editor-addons"
          )}
          initialOpen={false}
          className={
            isPost ? null : "responsive-block-editor-addons-hide-query"
          }
        >
          <QueryControls
            {...{ order, orderBy }}
            numberOfItems={attributes.postsToShow}
            onNumberOfItemsChange={(value) =>
              setAttributes({ postsToShow: value })
            }
          />
          <SelectControl
            label={__("Order By")}
            value={attributes.orderBy}
            onChange={(value) => setAttributes({ orderBy: value })}
            options={[
              { value: "date", label: __("Date") },
              { value: "title", label: __("Title") },
              { value: "rand", label: __("Random") },
              { value: "menu_order", label: __("Menu Order") },
            ]}
          />
          <SelectControl
            label={__("Order")}
            value={attributes.order}
            onChange={(value) => setAttributes({ order: value })}
            options={[
              { value: "desc", label: __("Descending") },
              { value: "asc", label: __("Ascending") },
            ]}
          />
          <RangeControl
            label={__(
              "Number of items to offset",
              "responsive-block-editor-addons"
            )}
            value={attributes.offset}
            onChange={(value) => setAttributes({ offset: value })}
            min={0}
            max={20}
          />
          {"grid" === attributes.postLayout && (
            <RangeControl
              label={__("Columns", "responsive-block-editor-addons")}
              value={attributes.columns}
              onChange={(value) => setAttributes({ columns: value })}
              min={1}
              max={
                !hasPosts
                  ? MAX_POSTS_COLUMNS
                  : Math.min(MAX_POSTS_COLUMNS, latestPosts.length)
              }
            />
          )}
          <ToggleControl
            label={__("Equal Height", "responsive-block-editor-addons")}
            checked={attributes.equalHeight}
            onChange={() =>
              this.props.setAttributes({
                equalHeight: !attributes.equalHeight,
              })
            }
          />
          <ToggleControl
            label={__("Post Pagination", "responsive-block-editor-addons")}
            checked={attributes.postPagination}
            onChange={() =>
              this.props.setAttributes({
                postPagination: !attributes.postPagination,
                paginationMarkup: "empty",
              })
            }
          />
          <RangeControl
            label={__("Page Limit", "responsive-block-editor-addons")}
            value={attributes.pageLimit}
            onChange={(value) =>
              setAttributes({
                pageLimit: value,
                paginationMarkup: "empty",
              })
            }
            min={0}
            max={100}
          />
        </PanelBody>
        <PanelBody
          title={__("Pagination", "responsive-block-editor-addons")}
          initialOpen={false}
        >
          <SelectControl
            label={__("Pagination Layout", "responsive-block-editor-addons")}
            options={[
              {
                value: "border",
                label: __("Border", "responsive-block-editor-addons"),
              },
              {
                value: "filled",
                label: __("Filled", "responsive-block-editor-addons"),
              },
            ]}
            value={attributes.paginationLayout}
            onChange={(value) =>
              this.props.setAttributes({ paginationLayout: value })
            }
          />
          <SelectControl
            label={__("Pagination Alignment", "responsive-block-editor-addons")}
            options={[
              {
                value: "left",
                label: __("Left", "responsive-block-editor-addons"),
              },
              {
                value: "center",
                label: __("Center", "responsive-block-editor-addons"),
              },
              {
                value: "right",
                label: __("Right", "responsive-block-editor-addons"),
              },
            ]}
            value={attributes.paginationAlignment}
            onChange={(value) =>
              this.props.setAttributes({ paginationAlignment: value })
            }
          />
          <RangeControl
            label={__("Border Size", "responsive-block-editor-addons")}
            value={attributes.paginationBorderWidth}
            onChange={(value) =>
              setAttributes({ paginationBorderWidth: value })
            }
            min={0}
            max={150}
          />
          <p className="responsive-setting-label">
            {__("Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{ backgroundColor: attributes.paginationBorderColor }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.paginationBorderColor}
            onChange={(value) =>
              this.props.setAttributes({
                paginationBorderColor: value,
              })
            }
            allowReset
          />
          <RangeControl
            label={__("Border Radius", "responsive-block-editor-addons")}
            value={attributes.paginationBorderRadius}
            onChange={(value) =>
              setAttributes({ paginationBorderRadius: value })
            }
            min={0}
            max={150}
          />
          <p className="responsive-setting-label">
            {__("Active Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.paginationActiveBorderColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.paginationActiveBorderColor}
            onChange={(value) =>
              this.props.setAttributes({
                paginationActiveBorderColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Text Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{ backgroundColor: attributes.paginationTextColor }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.paginationTextColor}
            onChange={(value) =>
              this.props.setAttributes({
                paginationTextColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Active Text Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.paginationTextActiveColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.paginationTextActiveColor}
            onChange={(value) =>
              this.props.setAttributes({
                paginationTextActiveColor: value,
              })
            }
            allowReset
          />
          <RangeControl
            label={__("Spacing", "responsive-block-editor-addons")}
            value={attributes.paginationSpacing}
            onChange={(value) => setAttributes({ paginationSpacing: value })}
            min={0}
            max={500}
          />
          <TextControl
            label={__("Previous Button Text", "responsive-block-editor-addons")}
            type="text"
            value={attributes.previousButtonText}
            onChange={(value) =>
              this.props.setAttributes({
                previousButtonText: value,
                paginationMarkup: "empty",
              })
            }
          />
          <TextControl
            label={__("Next Button Text", "responsive-block-editor-addons")}
            type="text"
            value={attributes.nextButtonText}
            onChange={(value) =>
              this.props.setAttributes({
                nextButtonText: value,
                paginationMarkup: "empty",
              })
            }
          />
        </PanelBody>
        <PanelBody
          title={__(
            "Post and Page Grid Content",
            "responsive-block-editor-addons"
          )}
          initialOpen={false}
        >
          {"list" === attributes.postLayout && (
            <ToggleControl
              label={__(
                "Stack Image & Content on mobile",
                "responsive-block-editor-addons"
              )}
              checked={attributes.stackonMobile}
              onChange={() =>
                this.props.setAttributes({
                  stackonMobile: !attributes.stackonMobile,
                })
              }
            />
          )}
          <ToggleControl
            label={__(
              "Display Section Title",
              "responsive-block-editor-addons"
            )}
            checked={attributes.displaySectionTitle}
            onChange={() =>
              this.props.setAttributes({
                displaySectionTitle: !attributes.displaySectionTitle,
              })
            }
          />
          {attributes.displaySectionTitle && (
            <TextControl
              label={__("Section Title", "responsive-block-editor-addons")}
              type="text"
              value={attributes.sectionTitle}
              onChange={(value) =>
                this.props.setAttributes({
                  sectionTitle: value,
                })
              }
            />
          )}
          <ToggleControl
            label={__(
              "Display Featured Image",
              "responsive-block-editor-addons"
            )}
            checked={attributes.displayPostImage}
            onChange={() =>
              this.props.setAttributes({
                displayPostImage: !attributes.displayPostImage,
              })
            }
          />
          {attributes.displayPostImage && [
            <SelectControl
              label={__("Image Size", "responsive-block-editor-addons")}
              value={imageSizeValue()}
              options={imageSizeOptions}
              onChange={(value) =>
                this.props.setAttributes({
                  imageSize: value,
                })
              }
            />,
            <SelectControl
              label={__("Image Position", "responsive-block-editor-addons")}
              value={attributes.imagePosition}
              options={[
                {
                  value: "top",
                  label: __("Top", "responsive-block-editor-addons"),
                },
                {
                  value: "background",
                  label: __("Background", "responsive-block-editor-addons"),
                },
              ]}
              onChange={(value) =>
                this.props.setAttributes({
                  imagePosition: value,
                })
              }
            />,
            <SelectControl
              label={__("Layout", "responsive-block-editor-addons")}
              value={attributes.layout}
              options={[
                {
                  value: "boxed",
                  label: __("Boxed", "responsive-block-editor-addons"),
                },
                {
                  value: "content",
                  label: __("Content", "responsive-block-editor-addons"),
                },
              ]}
              onChange={(value) =>
                this.props.setAttributes({
                  layout: value,
                })
              }
            />,
            <RangeControl
              label={__("Image Border Radius")}
              value={attributes.imageBorderRadius}
              onChange={(value) =>
                this.props.setAttributes({
                  imageBorderRadius: value,
                })
              }
              min={0}
              max={100}
            />,
          ]}
          <ToggleControl
            label={__("Display Title", "responsive-block-editor-addons")}
            checked={attributes.displayPostTitle}
            onChange={() =>
              this.props.setAttributes({
                displayPostTitle: !attributes.displayPostTitle,
              })
            }
          />
          {isPost && (
            <ToggleControl
              label={__("Display Author", "responsive-block-editor-addons")}
              checked={attributes.displayPostAuthor}
              onChange={() =>
                this.props.setAttributes({
                  displayPostAuthor: !attributes.displayPostAuthor,
                })
              }
            />
          )}
          {isPost && (
            <ToggleControl
              label={__("Display Date", "responsive-block-editor-addons")}
              checked={attributes.displayPostDate}
              onChange={() =>
                this.props.setAttributes({
                  displayPostDate: !attributes.displayPostDate,
                })
              }
            />
          )}
          <ToggleControl
            label={__("Display Excerpt", "responsive-block-editor-addons")}
            checked={attributes.displayPostExcerpt}
            onChange={() =>
              this.props.setAttributes({
                displayPostExcerpt: !attributes.displayPostExcerpt,
              })
            }
          />
          {attributes.displayPostExcerpt && (
            <RangeControl
              label={__("Excerpt Length", "responsive-block-editor-addons")}
              value={attributes.excerptLength}
              onChange={(value) => setAttributes({ excerptLength: value })}
              min={0}
              max={55}
            />
          )}
          <ToggleControl
            label={__(
              "Display Continue Reading Link",
              "responsive-block-editor-addons"
            )}
            checked={attributes.displayPostLink}
            onChange={() =>
              this.props.setAttributes({
                displayPostLink: !attributes.displayPostLink,
              })
            }
          />
          {attributes.displayPostLink && (
            <TextControl
              label={__(
                "Customize Continue Reading Text",
                "responsive-block-editor-addons"
              )}
              type="text"
              value={attributes.readMoreText}
              onChange={(value) =>
                this.props.setAttributes({
                  readMoreText: value,
                })
              }
            />
          )}
        </PanelBody>
        <PanelBody
          title={__(
            "Post and Page Grid Markup",
            "responsive-block-editor-addons"
          )}
          initialOpen={false}
          className="responsive-block-editor-addons-block-post-grid-markup-settings"
        >
          <SelectControl
            label={__(
              "Post Grid Section Tag",
              "responsive-block-editor-addons"
            )}
            options={sectionTags}
            value={attributes.sectionTag}
            onChange={(value) =>
              this.props.setAttributes({ sectionTag: value })
            }
            help={__(
              "Change the post grid section tag to match your content hierarchy.",
              "responsive-block-editor-addons"
            )}
          />
          {attributes.sectionTitle && (
            <SelectControl
              label={__(
                "Section Title Heading Tag",
                "responsive-block-editor-addons"
              )}
              options={sectionTitleTags}
              value={attributes.sectionTitleTag}
              onChange={(value) =>
                this.props.setAttributes({
                  sectionTitleTag: value,
                })
              }
              help={__(
                "Change the post/page section title tag to match your content hierarchy.",
                "responsive-block-editor-addons"
              )}
            />
          )}
          {attributes.displayPostTitle && (
            <SelectControl
              label={__(
                "Post Title Heading Tag",
                "responsive-block-editor-addons"
              )}
              options={sectionTitleTags}
              value={attributes.postTitleTag}
              onChange={(value) =>
                this.props.setAttributes({
                  postTitleTag: value,
                })
              }
              help={__(
                "Change the post/page title tag to match your content hierarchy.",
                "responsive-block-editor-addons"
              )}
            />
          )}
        </PanelBody>
        <PanelBody
          title={__("Typography", "responsive-block-editor-addons")}
          initialOpen={false}
        >
          <PanelBody
            title={__("Excerpt", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <SelectControl
              label={__("Font Family", "responsive-block-editor-addons")}
              options={fontOptions}
              value={attributes.excerptFontFamily}
              onChange={(value) => {
                this.props.setAttributes({
                  excerptFontFamily: value,
                }),
                  loadGoogleFont(value);
              }}
            />
            <RangeControl
              label={__("Font Size", "responsive-block-editor-addons")}
              value={attributes.excerptFontSize}
              onChange={(value) =>
                this.props.setAttributes({
                  excerptFontSize: value,
                })
              }
              min={0}
              max={50}
              step={1}
            />
            <SelectControl
              label={__("Font Weight", "responsive-block-editor-addons")}
              options={fontWeightOptions}
              value={attributes.excerptFontWeight}
              onChange={(value) =>
                this.props.setAttributes({
                  excerptFontWeight: value,
                })
              }
            />
            <RangeControl
              label={__("Line Height", "responsive-block-editor-addons")}
              value={attributes.excerptLineHeight}
              onChange={(value) =>
                this.props.setAttributes({
                  excerptLineHeight: value,
                })
              }
              min={0}
              max={100}
              step={1}
            />
            <SelectControl
              label={__("Text Transform", "responsive-block-editor-addons")}
              options={textTransformOptions}
              value={attributes.excerptTextTransform}
              onChange={(value) =>
                this.props.setAttributes({
                  excerptTextTransform: value,
                })
              }
            />
          </PanelBody>
          <PanelBody
            title={__("Meta", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <SelectControl
              label={__("Font Family", "responsive-block-editor-addons")}
              options={fontOptions}
              value={attributes.metaFontFamily}
              onChange={(value) => {
                this.props.setAttributes({
                  metaFontFamily: value,
                }),
                  loadGoogleFont(value);
              }}
            />
            <RangeControl
              label={__("Font Size", "responsive-block-editor-addons")}
              value={attributes.metaFontSize}
              onChange={(value) =>
                this.props.setAttributes({
                  metaFontSize: value,
                })
              }
              min={0}
              max={50}
              step={1}
            />
            <SelectControl
              label={__("Font Weight", "responsive-block-editor-addons")}
              options={fontWeightOptions}
              value={attributes.metaFontWeight}
              onChange={(value) =>
                this.props.setAttributes({
                  metaFontWeight: value,
                })
              }
            />
            <RangeControl
              label={__("Line Height", "responsive-block-editor-addons")}
              value={attributes.metaLineHeight}
              onChange={(value) =>
                this.props.setAttributes({
                  metaLineHeight: value,
                })
              }
              min={0}
              max={100}
              step={1}
            />
            <SelectControl
              label={__("Text Transform", "responsive-block-editor-addons")}
              options={textTransformOptions}
              value={attributes.metaTextTransform}
              onChange={(value) =>
                this.props.setAttributes({
                  metaTextTransform: value,
                })
              }
            />
          </PanelBody>
          <PanelBody
            title={__("Title", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <SelectControl
              label={__("Font Family", "responsive-block-editor-addons")}
              options={fontOptions}
              value={attributes.titleFontFamily}
              onChange={(value) => {
                this.props.setAttributes({
                  titleFontFamily: value,
                }),
                  loadGoogleFont(value);
              }}
            />
            <TabPanel
              className=" responsive-size-type-field-tabs  responsive-size-type-field__common-tabs  responsive-inline-margin"
              activeClass="active-tab"
              tabs={[
                {
                  name: "desktop",
                  title: <Dashicon icon="desktop" />,
                  className:
                    " responsive-desktop-tab  responsive-responsive-tabs",
                },
                {
                  name: "tablet",
                  title: <Dashicon icon="tablet" />,
                  className:
                    " responsive-tablet-tab  responsive-responsive-tabs",
                },
                {
                  name: "mobile",
                  title: <Dashicon icon="smartphone" />,
                  className:
                    " responsive-mobile-tab  responsive-responsive-tabs",
                },
              ]}
            >
              {(tab) => {
                let tabout;

                if ("mobile" === tab.name) {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__(
                          "Font Size",
                          "responsive-block-editor-addons"
                        )}
                        min={0}
                        max={500}
                        value={attributes.titleFontSizeMobile}
                        onChange={(value) =>
                          setAttributes({
                            titleFontSizeMobile: value,
                          })
                        }
                      />
                    </Fragment>
                  );
                } else if ("tablet" === tab.name) {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__(
                          "Font Size",
                          "responsive-block-editor-addons"
                        )}
                        min={0}
                        max={500}
                        value={attributes.titleFontSizeTablet}
                        onChange={(value) =>
                          setAttributes({
                            titleFontSizeTablet: value,
                          })
                        }
                      />
                    </Fragment>
                  );
                } else {
                  tabout = (
                    <Fragment>
                      <RangeControl
                        label={__(
                          "Font Size",
                          "responsive-block-editor-addons"
                        )}
                        min={0}
                        max={500}
                        value={attributes.titleFontSize}
                        onChange={(value) =>
                          setAttributes({
                            titleFontSize: value,
                          })
                        }
                      />
                    </Fragment>
                  );
                }

                return <div>{tabout}</div>;
              }}
            </TabPanel>
            <SelectControl
              label={__("Font Weight", "responsive-block-editor-addons")}
              options={fontWeightOptions}
              value={attributes.titleFontWeight}
              onChange={(value) =>
                this.props.setAttributes({
                  titleFontWeight: value,
                })
              }
            />
            <RangeControl
              label={__("Line Height", "responsive-block-editor-addons")}
              value={attributes.titleLineHeight}
              onChange={(value) =>
                this.props.setAttributes({
                  titleLineHeight: value,
                })
              }
              min={0}
              max={100}
              step={1}
            />
            <SelectControl
              label={__("Text Transform", "responsive-block-editor-addons")}
              options={textTransformOptions}
              value={attributes.titleTextTransform}
              onChange={(value) =>
                this.props.setAttributes({
                  titleTextTransform: value,
                })
              }
            />
          </PanelBody>
          <PanelBody
            title={__("Read More Link", "responsive-block-editor-addons")}
            initialOpen={false}
          >
            <RangeControl
              label={__("Font Size", "responsive-block-editor-addons")}
              min={0}
              max={500}
              value={attributes.continueFontSize}
              onChange={(value) =>
                setAttributes({
                  continueFontSize: value,
                })
              }
            />
            <SelectControl
              label={__("Font Weight", "responsive-block-editor-addons")}
              options={fontWeightOptions}
              value={attributes.continueFontWeight}
              onChange={(value) =>
                this.props.setAttributes({
                  continueFontWeight: value,
                })
              }
            />
            <RangeControl
              label={__("Line Height", "responsive-block-editor-addons")}
              value={attributes.continueLineHeight}
              onChange={(value) =>
                this.props.setAttributes({
                  continueLineHeight: value,
                })
              }
              min={0}
              max={100}
              step={1}
            />
            <SelectControl
              label={__("Text Transform", "responsive-block-editor-addons")}
              options={textTransformOptions}
              value={attributes.continueTextTransform}
              onChange={(value) =>
                this.props.setAttributes({
                  continueTextTransform: value,
                })
              }
            />
          </PanelBody>
        </PanelBody>
        <PanelBody
          title={__("Border", "responsive-block-editor-addons")}
          initialOpen={false}
        >
          <SelectControl
            label={__("Border Style")}
            value={attributes.blockBorderStyle}
            onChange={(value) =>
              this.props.setAttributes({ blockBorderStyle: value })
            }
            options={[
              { value: "none", label: __("None") },
              { value: "solid", label: __("Solid") },
              { value: "dotted", label: __("Dotted") },
              { value: "dashed", label: __("Dashed") },
              { value: "double", label: __("Double") },
              { value: "groove", label: __("Groove") },
              { value: "inset", label: __("Inset") },
              { value: "outset", label: __("Outset") },
              { value: "ridge", label: __("Ridge") },
            ]}
          />
          {"none" != attributes.blockBorderStyle && (
            <RangeControl
              label={__("Border Width")}
              value={attributes.blockBorderWidth}
              onChange={(value) =>
                this.props.setAttributes({
                  blockBorderWidth: value !== undefined ? value : 1,
                })
              }
              min={0}
              max={50}
              allowReset
            />
          )}
          <RangeControl
            label={__("Border Radius")}
            value={attributes.blockBorderRadius}
            onChange={(value) =>
              this.props.setAttributes({
                blockBorderRadius: value !== undefined ? value : "",
              })
            }
            min={0}
            max={1000}
            allowReset
          />
          {"none" != attributes.blockBorderStyle && (
            <Fragment>
              <p className="responsive-setting-label">
                {__("Border Color")}
                <span className="components-base-control__label">
                  <span
                    className="component-color-indicator"
                    style={{ backgroundColor: attributes.blockBorderColor }}
                  ></span>
                </span>
              </p>
              <ColorPalette
                value={attributes.blockBorderColor}
                onChange={(colorValue) =>
                  this.props.setAttributes({ blockBorderColor: colorValue })
                }
                allowReset
              />
            </Fragment>
          )}
          <BoxShadowControl
            setAttributes={setAttributes}
            label={__("Box Shadow")}
            boxShadowColor={{
              value: attributes.boxShadowColor,
              label: __("Color"),
            }}
            boxShadowHOffset={{
              value: attributes.boxShadowHOffset,
              label: __("Horizontal"),
            }}
            boxShadowVOffset={{
              value: attributes.boxShadowVOffset,
              label: __("Vertical"),
            }}
            boxShadowBlur={{
              value: attributes.boxShadowBlur,
              label: __("Blur"),
            }}
            boxShadowSpread={{
              value: attributes.boxShadowSpread,
              label: __("Spread"),
            }}
            boxShadowPosition={{
              value: attributes.boxShadowPosition,
              label: __("Position"),
            }}
          />
          <BoxShadowControlHelper
            setAttributes={setAttributes}
            boxShadowColor={{ value: attributes.hoverboxShadowColor }}
            boxShadowHOffset={{value: attributes.hoverboxShadowHOffset}}
            boxShadowVOffset={{value: attributes.hoverboxShadowVOffset}}
            boxShadowBlur={{value: attributes.hoverboxShadowBlur }}
            boxShadowSpread={{value: attributes.hoverboxShadowSpread}}
            boxShadowPosition={{value: attributes.hoverboxShadowPosition}}
            label={__("Hover Box Shadow")}
            attrNameTemplate="hover%s"
          />
        </PanelBody>
        <PanelBody
          title={__("Color", "responsive-block-editor-addons")}
          initialOpen={false}
        >
          <p className="responsive-setting-label">
            {__("Background")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{ backgroundColor: attributes.bgColor }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.bgColor}
            onChange={(value) =>
              this.props.setAttributes({
                bgColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Title Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.titleColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.titleColor}
            onChange={(value) =>
              this.props.setAttributes({
                titleColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Title Hover Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.titleHoverColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.titleHoverColor}
            onChange={(value) =>
              this.props.setAttributes({
                titleHoverColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Meta Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.metaColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.metaColor}
            onChange={(value) =>
              this.props.setAttributes({
                metaColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Excerpt Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.textColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.textColor}
            onChange={(value) =>
              this.props.setAttributes({
                textColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Read More Link Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.readMoreLinkColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.readMoreLinkColor}
            onChange={(value) =>
              this.props.setAttributes({
                readMoreLinkColor: value,
              })
            }
            allowReset
          />
          <p className="responsive-setting-label">
            {__("Read More Hover Color")}
            <span className="components-base-control__label">
              <span
                className="component-color-indicator"
                style={{
                  backgroundColor: attributes.readMoreHoverColor,
                }}
              ></span>
            </span>
          </p>
          <ColorPalette
            value={attributes.readMoreHoverColor}
            onChange={(value) =>
              this.props.setAttributes({
                readMoreHoverColor: value,
              })
            }
            allowReset
          />
        </PanelBody>
        <PanelBody
          title={__("Spacing", "responsive-block-editor-addons")}
          initialOpen={false}
        >
          <TabPanel
            className=" responsive-size-type-field-tabs  responsive-size-type-field__common-tabs  responsive-inline-margin"
            activeClass="active-tab"
            tabs={[
              {
                name: "desktop",
                title: <Dashicon icon="desktop" />,
                className:
                  " responsive-desktop-tab  responsive-responsive-tabs",
              },
              {
                name: "tablet",
                title: <Dashicon icon="tablet" />,
                className: " responsive-tablet-tab  responsive-responsive-tabs",
              },
              {
                name: "mobile",
                title: <Dashicon icon="smartphone" />,
                className: " responsive-mobile-tab  responsive-responsive-tabs",
              },
            ]}
          >
            {(tab) => {
              let tabout;

              if ("mobile" === tab.name) {
                tabout = (
                  <Fragment>
                    <RangeControl
                      label={__("Row Gap Mobile", "atomic-blocks")}
                      value={attributes.rowGapMobile}
                      onChange={(value) =>
                        this.props.setAttributes({
                          rowGapMobile: value,
                        })
                      }
                      min={0}
                      max={50}
                      step={1}
                    />
                  </Fragment>
                );
              } else if ("tablet" === tab.name) {
                tabout = (
                  <Fragment>
                    <RangeControl
                      label={__("Row Gap Tablet", "atomic-blocks")}
                      value={attributes.rowGapTablet}
                      onChange={(value) =>
                        this.props.setAttributes({
                          rowGapTablet: value,
                        })
                      }
                      min={0}
                      max={50}
                      step={1}
                    />
                  </Fragment>
                );
              } else {
                tabout = (
                  <Fragment>
                    <RangeControl
                      label={__("Row Gap", "atomic-blocks")}
                      value={attributes.rowGap}
                      onChange={(value) =>
                        this.props.setAttributes({
                          rowGap: value,
                        })
                      }
                      min={0}
                      max={50}
                      step={1}
                    />
                  </Fragment>
                );
              }

              return <div>{tabout}</div>;
            }}
          </TabPanel>
          <TabPanel
            className=" responsive-size-type-field-tabs  responsive-size-type-field__common-tabs  responsive-inline-margin"
            activeClass="active-tab"
            tabs={[
              {
                name: "desktop",
                title: <Dashicon icon="desktop" />,
                className:
                  " responsive-desktop-tab  responsive-responsive-tabs",
              },
              {
                name: "tablet",
                title: <Dashicon icon="tablet" />,
                className: " responsive-tablet-tab  responsive-responsive-tabs",
              },
              {
                name: "mobile",
                title: <Dashicon icon="smartphone" />,
                className: " responsive-mobile-tab  responsive-responsive-tabs",
              },
            ]}
          >
            {(tab) => {
              let tabout;
              if ("mobile" === tab.name) {
                tabout = (
                  <Fragment>
                    <RangeControl
                      label={__("Column Gap Mobile", "atomic-blocks")}
                      value={attributes.columnGapMobile}
                      onChange={(value) =>
                        this.props.setAttributes({
                          columnGapMobile: value,
                        })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </Fragment>
                );
              } else if ("tablet" === tab.name) {
                tabout = (
                  <Fragment>
                    <RangeControl
                      label={__("Column Gap Tablet", "atomic-blocks")}
                      value={attributes.columnGapTablet}
                      onChange={(value) =>
                        this.props.setAttributes({
                          columnGapTablet: value,
                        })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </Fragment>
                );
              } else {
                tabout = (
                  <Fragment>
                    <RangeControl
                      label={__("Column Gap", "atomic-blocks")}
                      value={attributes.columnGap}
                      onChange={(value) =>
                        this.props.setAttributes({
                          columnGap: value,
                        })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </Fragment>
                );
              }

              return <div>{tabout}</div>;
            }}
          </TabPanel>
          <RangeControl
            label={__("Content Padding", "atomic-blocks")}
            value={attributes.contentPadding}
            onChange={(value) =>
              this.props.setAttributes({
                contentPadding: value,
              })
            }
            min={0}
            max={100}
            step={1}
          />
          <RangeControl
            label={__("Mobile Content Padding", "atomic-blocks")}
            value={attributes.mobileContentPadding}
            onChange={(value) =>
              this.props.setAttributes({
                mobileContentPadding: value,
              })
            }
            min={0}
            max={100}
            step={1}
          />
          <RangeControl
            label={__("Title Bottom Spacing", "atomic-blocks")}
            value={attributes.titleBottomSpacing}
            onChange={(value) =>
              this.props.setAttributes({
                titleBottomSpacing: value,
              })
            }
            min={0}
            max={50}
            step={1}
          />
          <RangeControl
            label={__("Meta Bottom Spacing", "atomic-blocks")}
            value={attributes.metaBottomSpacing}
            onChange={(value) =>
              this.props.setAttributes({
                metaBottomSpacing: value,
              })
            }
            min={0}
            max={50}
            step={1}
          />
          <RangeControl
            label={__("Excerpt Bottom Spacing", "atomic-blocks")}
            value={attributes.excerptBottomSpacing}
            onChange={(value) =>
              this.props.setAttributes({
                excerptBottomSpacing: value,
              })
            }
            min={0}
            max={50}
            step={1}
          />
        </PanelBody>
      </InspectorControls>
    );
  }
}
