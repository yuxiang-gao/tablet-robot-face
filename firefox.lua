debug_print("Application: " .. get_application_name())
debug_print("Window: " .. get_window_name());
if (get_application_name() == "Firefox") then
	set_window_fullscreen(true)
end
