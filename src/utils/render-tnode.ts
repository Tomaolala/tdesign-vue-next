import { h, SetupContext, isVNode, createTextVNode, VNode, ComponentPublicInstance  } from 'vue';

// 组件render属性的ts类型
type RenderTsTypesSimple = string | number | boolean;
type RenderTsTypesObject = Record<string, any> | Array<any>;
type RenderTsTypes  = VNode | TNode | RenderTsTypesSimple | RenderTsTypesObject
// 组件render属性的js类型
const RenderJsTypes = [Function, String, Number, Boolean, Object, Array];

// 定义组件内容的渲染方式
enum RenderWay {
  Text = 'text',
  JsonString = 'jsonstring',
  VNode = 'vnode',
  Unknown = 'unknown'
}


/**
 * 根据传入的值（对象），判断渲染该值（对象）的方式
 * @param value 传入的值（对象）
 */
const getValueRenderWay = (value: RenderTsTypes): RenderWay => {
  // 简单类型
  if (['string', 'number', 'boolean'].includes(typeof value)) return RenderWay.Text;
  // 复杂对象
  if (typeof value === 'object') {
    // 虚拟dom对象
    if (isVNode(value)) {
      return RenderWay.VNode;
    }
    // 其他复杂对象或数组
    return RenderWay.JsonString;
  }
  // 未知类型（兜底）
  return RenderWay.Unknown;
};

// 通过template的方式渲染TNode
export const RenderTNodeTemplate = (props: { render: Function, params: Object }, ctx: SetupContext) => {
  const { render, params } = props;
  const renderResult = (typeof render === 'function') ? render(h, params) : render;
  const renderWay = getValueRenderWay(renderResult);

  // @ts-ignore
  const renderText = (c: RenderTsTypesSimple | RenderTsTypesObject) => createTextVNode(c);
  const renderMap = {
    [RenderWay.Text]: (c: RenderTsTypesSimple) => renderText(c),
    [RenderWay.JsonString]: (c: RenderTsTypesObject) => renderText(JSON.stringify(c, null, 2)),
    [RenderWay.VNode]: (c: VNode) => c,
  };

  return renderMap[renderWay] ? renderMap[renderWay](renderResult) : h(null);
}

// 通过JSX的方式渲染TNode
export const renderTNodeJSX = (vm: ComponentPublicInstance, name: string) => {
  const propsNode = vm[name];
  if (typeof propsNode === 'function') return propsNode(h);
  if (!propsNode && vm.$slots[name]) return vm.$slots[name](null);
  return propsNode;
};