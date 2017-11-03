# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

activate :dato, live_reload: true

# enable livereload on development
configure :development do
  activate :livereload
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

ignore "service.html"
dato.services.each do |service| 
  proxy "services/#{service.slug}.html", "/service.html", locals: { service: service }
end

ignore "child_page.html"
dato.child_pages.each do |child_page| 
  proxy "#{child_page.parent_page.slug}/#{child_page.slug}.html", "/child_page.html", locals: { child_page: child_page }
end

ignore "parent_page.html"
dato.parent_pages.each do |parent_page| 
  proxy "/#{parent_page.slug}.html", "/parent_page.html", locals: { parent_page: parent_page }
end

activate :external_pipeline,
  name: :gulp,
  command: " cd source && gulp",
  source: ".static/dist",
  latency: 1

config[:css_dir] = 'static/dist/css'
config[:js_dir] = 'static/dist/js'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end
