import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// Collapsible Root
function Collapsible(props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

// Collapsible Trigger
function CollapsibleTrigger(props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

// Collapsible Content
function CollapsibleContent(props) {
  return (
    <CollapsiblePrimitive.Content data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
